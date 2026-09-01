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

  // Explicit transcription instructions. This is the single most important
  // lever that prevents Gemini from romanizing/transliterating Hindi speech
  // into Hinglish. `speechConfig.languageCode` only communicates LANGUAGE
  // (e.g. hi-IN), not SCRIPT. Without an explicit script mandate, Gemini's
  // audio transcription defaults to Latin/Hinglish output for Hindi audio.
  // The systemInstruction below pins the script so Hindi is rendered in
  // Devanagari while English stays Latin, and mixed speech keeps each
  // language's native script (code-switching).
  const systemInstruction = [
    'You are a verbatim speech-to-text transcription engine.',
    'Transcribe EXACTLY what the speaker says in the audio. Do not add, remove, or rephrase anything.',
    'Do NOT translate. Do NOT transliterate. Do NOT romanize. Do NOT convert spoken Hindi into Latin/Roman/Hinglish characters.',
    'When the speaker speaks Hindi, write the Hindi words using DEVANAGARI script (e.g. लाख की चूड़ियाँ, not "lac ke chudiya").',
    'When the speaker speaks Marathi, write the Marathi words using DEVANAGARI script.',
    'When the speaker speaks English, write English using Latin script.',
    'When the speaker code-switches between Hindi and English within one utterance, preserve the natural code-switching and use the appropriate native script for each language (Devanagari for Hindi/Marathi portions, Latin for English portions).',
    'Return ONLY the transcription text with no commentary, no quotes, no punctuation corrections, and no markdown.',
    'Do not summarize, paraphrase, or correct the speaker into another language. Preserve numbers, prices, and product names exactly as spoken.',
  ].join('\n');

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
                  { text: `Transcribe the following ${languageName} audio verbatim.` },
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
