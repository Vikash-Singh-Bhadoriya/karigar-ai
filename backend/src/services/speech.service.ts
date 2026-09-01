import path from 'path';
import {
  getGeminiApiKeys,
  getSpeechModel,
  isTransientFailure,
  runGeminiWithFailover,
} from '../config/gemini';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

// Guards against accidental duplicate concurrent transcription requests so a
// single user action never fans out into multiple Gemini calls.
let transcriptionInFlight: Promise<string> | null = null;

export class SpeechServiceError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'SpeechServiceError';
    this.status = status;
  }
}

export function isRateLimitStatus(status: number): boolean {
  return status === 429 || status === 503;
}

export interface SpeechInput {
  audio: Buffer;
  mimeType: string;
  language?: string;
}

export function normalizeSpeechLanguage(language?: string): string {
  const l = (language ?? '').trim();
  if (l === 'hi' || l === 'mr' || l === 'en') return l;
  if (l.includes('मराठी')) return 'mr';
  if (/en/i.test(l)) return 'en';
  return 'hi';
}

/** Maps a normalized language to a BCP-47 speech hint for Gemini. */
export function speechLanguageCode(language?: string): string {
  switch (normalizeSpeechLanguage(language)) {
    case 'mr':
      return 'mr-IN';
    case 'en':
      return 'en-IN';
    case 'hi':
    default:
      return 'hi-IN';
  }
}

/**
 * Builds the system instruction for a transcription request, driven by the
 * user-selected language (authoritative). It pins both the language to
 * transcribe and its required output script so Gemini never auto-romanizes or
 * auto-translates Hindi/Marathi, and never translates English into another
 * language. Proper nouns / brand names are kept in the faithful spoken script.
 */
function buildSpeechSystemInstruction(lang: string): string {
  const verbatimRules = [
    'You are a verbatim speech-to-text transcription engine.',
    'Transcribe EXACTLY and ONLY what the speaker says in the audio. Do not add, remove, correct, or rephrase anything.',
    'Do NOT summarize. Do NOT paraphrase. Do NOT translate. Do NOT transliterate. Do NOT romanize.',
    'Return ONLY the transcription text — no commentary, no quotes, no punctuation additions, no markdown.',
    'Preserve numbers, prices, product names, and proper noun / brand names exactly as spoken.',
  ];

  if (lang === 'mr') {
    return [
      ...verbatimRules,
      'The user explicitly selected MARATHI. Transcribe the audio as MARATHI.',
      'Write Marathi using DEVANAGARI script. Never convert Marathi into Latin/Roman characters.',
      'Never translate Marathi into English or Hindi.',
      'If the speaker incidentally uses an English technical/product word while speaking Marathi, keep that English word in Latin script and write the surrounding Marathi in Devanagari.',
    ].join('\n');
  }

  if (lang === 'en') {
    return [
      ...verbatimRules,
      'The user explicitly selected ENGLISH. Transcribe the audio as ENGLISH.',
      'Write English using LATIN script.',
      'Do NOT translate English into Hindi, Marathi, or any other language.',
      'If the speaker incidentally uses a Hindi/Marathi word while speaking English, keep that word in Devanagari and the surrounding English in Latin.',
    ].join('\n');
  }

  // Default / Hindi
  return [
    ...verbatimRules,
    'The user explicitly selected HINDI. Transcribe the audio as HINDI.',
    'Write Hindi using DEVANAGARI script. Never convert Hindi into Latin/Roman/Hinglish characters.',
    'Never translate Hindi into English.',
    'Keep proper nouns and brand names in their faithful spoken Hindi phonetic Devanagari form (e.g. "एसर के लैपटॉप", NOT "Acer ka Laptop").',
    'If the speaker naturally uses an English technical/product word while speaking Hindi, keep that English term in Latin script and write the surrounding Hindi in Devanagari (e.g. "ये handmade cotton bag है", NOT "ye handmade cotton bag hai").',
  ].join('\n');
}

export function mimeFromAudioName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  switch (ext) {
    case '.mp3':
    case '.mpeg':
      return 'audio/mpeg';
    case '.m4a':
      return 'audio/mp4';
    case '.aac':
      return 'audio/aac';
    case '.wav':
      return 'audio/wav';
    case '.webm':
      return 'audio/webm';
    case '.ogg':
      return 'audio/ogg';
    default:
      return 'audio/mp4';
  }
}

interface GeminiCandidate {
  content: { parts: Array<{ text?: string }> };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export async function transcribeAudio(input: SpeechInput): Promise<string> {
  if (getGeminiApiKeys().length === 0) {
    throw new SpeechServiceError(
      'Gemini API keys set नहीं हैं। स्पीच पहचान के लिए Gemini API key चाहिए।',
      500
    );
  }

  if (input.mimeType && !input.mimeType.startsWith('audio/')) {
    throw new SpeechServiceError('Invalid audio format. Only audio files are supported.', 400);
  }

  if (transcriptionInFlight) {
    throw new SpeechServiceError(
      'पिछली रिकॉर्डिंग अभी प्रोसेस हो रही है। थोड़ा इंतजार करके दोबारा कोशिश करें।',
      409
    );
  }

  const lang = normalizeSpeechLanguage(input.language);
  const languageName = { hi: 'Hindi', mr: 'Marathi', en: 'English' }[lang];
  const languageCode = speechLanguageCode(input.language);

  // The user-selected language is AUTHORITATIVE. It must drive both the
  // transcription language and the required output script — never depend on
  // Gemini auto-inferring the language/script. `speechConfig.languageCode`
  // (e.g. hi-IN) only communicates the LANGUAGE, not the SCRIPT; without an
  // explicit per-language script mandate Gemini still defaults to Latin /
  // Hinglish for Hindi/Marathi audio. The systemInstruction is built from the
  // selected language so it pins the language + script together and forbids
  // translation/transliteration/romanization/normalization.
  const systemInstruction = buildSpeechSystemInstruction(lang);

  const run = async (): Promise<string> => {
    const model = getSpeechModel();
    try {
      return await runGeminiWithFailover('speech', async (apiKey) => {
        const url = `${GEMINI_ENDPOINT}/${model}:generateContent`;
        console.log(`[VOICE PERF] Gemini request started at ${Date.now()}`);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: [
              {
                parts: [
                  { inline_data: { mime_type: input.mimeType, data: input.audio.toString('base64') } },
                  { text: `Transcribe this ${languageName} audio verbatim (as ${languageName}), preserving its native script.` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 1024,
              speechConfig: { languageCode },
            },
          }),
        });
        console.log(`[VOICE PERF] Gemini response received at ${Date.now()}`);

        if (!res.ok) {
          const body = await res.text();
          console.error(
            `[speech.service] Gemini audio error (${res.status}): ${body.slice(0, 300)}`
          );
          throw {
            status: res.status,
            body,
            transient: isTransientFailure(res.status, body),
          };
        }

        const data = (await res.json()) as GeminiResponse;
        const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== 'string' || !text.trim()) {
          throw new SpeechServiceError('Gemini returned empty transcription', 500);
        }
        return text.trim();
      });
    } catch (error) {
      if (error instanceof SpeechServiceError) throw error;
      const status = (error as { status?: number })?.status ?? 500;
      if (isRateLimitStatus(status)) {
        throw new SpeechServiceError(
          'Voice service अस्थायी रूप से व्यस्त है (rate limit)। कुछ सेकंड बाद फिर से कोशिश करें।',
          status
        );
      }
      throw new SpeechServiceError(`Gemini transcription error (${status})`, status);
    }
  };

  transcriptionInFlight = run();
  try {
    return await transcriptionInFlight;
  } finally {
    transcriptionInFlight = null;
  }
}
