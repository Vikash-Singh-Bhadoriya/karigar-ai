import path from 'path';
import {
  getGeminiApiKeys,
  getSpeechModel,
  isTransientFailure,
  runGeminiWithFailover,
} from '../config/gemini';
import { transcribeWithBhashini } from '../config/bhashini';

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

export interface IndicLangMeta {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  script: string;
}

export const INDIC_LANGUAGES: Record<string, IndicLangMeta> = {
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', bcp47: 'hi-IN', script: 'Devanagari' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', script: 'Bengali' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', script: 'Devanagari' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', script: 'Telugu' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', script: 'Tamil' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', script: 'Gujarati' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', script: 'Kannada' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', script: 'Malayalam' },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bcp47: 'or-IN', script: 'Odia' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', script: 'Gurmukhi' },
  as: { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', bcp47: 'as-IN', script: 'Bengali-Assamese' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-IN', script: 'Perso-Arabic' },
  ks: { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी / كٲشُر', bcp47: 'ks-IN', script: 'Perso-Arabic / Devanagari' },
  kok: { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', bcp47: 'kok-IN', script: 'Devanagari' },
  mai: { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', bcp47: 'mai-IN', script: 'Devanagari' },
  brx: { code: 'brx', name: 'Bodo', nativeName: 'बर\'', bcp47: 'brx-IN', script: 'Devanagari' },
  doi: { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', bcp47: 'doi-IN', script: 'Devanagari' },
  mni: { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', bcp47: 'mni-IN', script: 'Meitei Mayek / Bengali' },
  ne: { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', bcp47: 'ne-IN', script: 'Devanagari' },
  sa: { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', bcp47: 'sa-IN', script: 'Devanagari' },
  sat: { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', bcp47: 'sat-IN', script: 'Ol Chiki' },
  sd: { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', bcp47: 'sd-IN', script: 'Perso-Arabic / Devanagari' },
  en: { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-IN', script: 'Latin' },
};

export function resolveIndicLanguage(input?: string): IndicLangMeta {
  const raw = (input ?? '').trim().toLowerCase();
  if (!raw) return INDIC_LANGUAGES.hi;

  // Direct code match
  if (INDIC_LANGUAGES[raw]) return INDIC_LANGUAGES[raw];

  // Search by code, english name, or native script
  for (const meta of Object.values(INDIC_LANGUAGES)) {
    if (
      meta.code.toLowerCase() === raw ||
      meta.name.toLowerCase() === raw ||
      meta.nativeName.toLowerCase() === raw ||
      raw.includes(meta.name.toLowerCase()) ||
      raw.includes(meta.nativeName.toLowerCase())
    ) {
      return meta;
    }
  }

  return INDIC_LANGUAGES.hi;
}

export function normalizeSpeechLanguage(language?: string): string {
  return resolveIndicLanguage(language).code;
}

/** Maps a normalized language to a BCP-47 speech hint for Gemini / STT. */
export function speechLanguageCode(language?: string): string {
  return resolveIndicLanguage(language).bcp47;
}

/**
 * Builds the system instruction for a transcription request, driven by the
 * user-selected language (authoritative). It pins both the language to
 * transcribe and its required output script so Gemini never auto-romanizes or
 * auto-translates Indic speech, and never translates English into another
 * language. Proper nouns / brand names are kept in the faithful spoken script.
 */
function buildSpeechSystemInstruction(meta: IndicLangMeta): string {
  const verbatimRules = [
    'You are a verbatim speech-to-text transcription engine for Indian regional languages.',
    'Transcribe EXACTLY and ONLY what the speaker says in the audio. Do not add, remove, correct, or rephrase anything.',
    'Do NOT summarize. Do NOT paraphrase. Do NOT translate. Do NOT transliterate. Do NOT romanize.',
    'Return ONLY the transcription text — no commentary, no quotes, no punctuation additions, no markdown.',
    'Preserve numbers, prices, product names, and proper noun / brand names exactly as spoken.',
  ];

  if (meta.code === 'en') {
    return [
      ...verbatimRules,
      'The user explicitly selected ENGLISH. Transcribe the audio as ENGLISH in Latin script.',
      'Do NOT translate English into Hindi, Marathi, Tamil, or any other language.',
      'If the speaker incidentally uses an Indian craft/cultural word while speaking English, write that word phonetically or in its authentic form.',
    ].join('\n');
  }

  return [
    ...verbatimRules,
    `The user explicitly selected ${meta.name.toUpperCase()} (${meta.nativeName}). Transcribe the audio strictly as ${meta.name.toUpperCase()}.`,
    `Write ${meta.name} using ${meta.script.toUpperCase()} script. Never convert ${meta.name} into Latin/Roman/English characters.`,
    `Never translate ${meta.name} into English, Hindi, or any other language.`,
    `Keep proper nouns, artisan craft terms, and brand names in their faithful spoken phonetic form.`,
    `If the speaker naturally uses an English technical/product word while speaking ${meta.name}, keep that English term in Latin script and write the surrounding ${meta.name} in ${meta.script} script.`,
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

  const meta = resolveIndicLanguage(input.language);
  const languageName = meta.name;
  const languageCode = meta.bcp47;

  // The user-selected language is AUTHORITATIVE. It drives both the
  // transcription language and the required output script for all 22 Indian languages.
  const systemInstruction = buildSpeechSystemInstruction(meta);

  const run = async (): Promise<string> => {
    // 1. Primary Engine: Digital India Bhashini (NLTM) ASR (if configured)
    const bhashiniResult = await transcribeWithBhashini(
      input.audio.toString('base64'),
      meta.code
    );
    if (bhashiniResult) {
      console.log(`[SPEECH] successfully transcribed via Bhashini DPI for ${meta.name}`);
      return bhashiniResult;
    }

    // 2. Secondary Engine: Gemini Multimodal Audio (Cloud Fallback)
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
