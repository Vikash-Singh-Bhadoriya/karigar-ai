import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  setAudioModeAsync,
} from 'expo-audio';
import type { AudioRecorder, RecorderState, RecordingOptions } from 'expo-audio';
import type { Language } from '@/types/product';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

const TRANSCRIBE_PATH = '/api/speech/transcribe';

// Voice-only recording tuned for speech transcription: mono + moderate AAC
// bitrate. This is far smaller than the stereo 128kbps HIGH_QUALITY preset,
// which is the dominant contributor to upload/transcription latency. Mono is
// more than sufficient for a single voice track.
const VOICE_RECORDING_OPTIONS: RecordingOptions = {
  extension: '.m4a',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 32000,
  android: {
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
  },
  ios: {
    outputFormat: 'aac ',
    audioQuality: 32,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 32000,
  },
};

function voicePerf(stage: string, fromMs?: number) {
  const now = Date.now();
  const elapsed = fromMs !== undefined ? ` +${now - fromMs}ms` : '';
  console.log(`[VOICE PERF] ${stage} at ${now}${elapsed}`);
}

export function toSpeechLocale(language: Language): string {
  switch (language) {
    case 'हिंदी':
      return 'hi-IN';
    case 'मराठी':
      return 'mr-IN';
    case 'English':
      return 'en-IN';
    default:
      return 'hi-IN';
  }
}

function languageHint(language: Language): string {
  switch (language) {
    case 'हिंदी':
      return 'हिंदी';
    case 'मराठी':
      return 'मराठी';
    case 'English':
      return 'English';
    default:
      return 'हिंदी';
  }
}

export function requestRecordingPermissions() {
  return AudioModule.requestRecordingPermissionsAsync();
}

export async function enableRecordingMode() {
  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
}

export type { AudioRecorder, RecorderState };

export function useRecorder() {
  const recorder = useAudioRecorder(VOICE_RECORDING_OPTIONS);
  const state = useAudioRecorderState(recorder);
  return { recorder, state };
}

export async function startRecording(recorder: AudioRecorder) {
  if (!recorder) return;
  await recorder.prepareToRecordAsync();
  recorder.record();
}

export async function stopRecording(recorder: AudioRecorder): Promise<string | null> {
  const startedAt = Date.now();
  voicePerf('recording stopped');
  if (recorder?.isRecording) {
    await recorder.stop();
  }
  const uri = recorder?.uri ?? null;
  voicePerf('audio URI ready', startedAt);
  return uri;
}

export async function transcribeAudio(
  uri: string,
  language: Language
): Promise<string> {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_URL set नहीं है। प्रोजेक्ट root में .env बनाकर अपना backend URL डालें।'
    );
  }

  const fileName = uri.split('/').pop() ?? `speech-${Date.now()}.m4a`;
  const mimeType = fileName.toLowerCase().endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg';

  const body = new FormData();
  body.append('audio', { uri, name: fileName, type: mimeType } as unknown as Blob);
  body.append('language', languageHint(language));

  let res: Response;
  const uploadStartedAt = Date.now();
  voicePerf('upload started', uploadStartedAt);
  try {
    res = await fetch(`${API_URL}${TRANSCRIBE_PATH}`, {
      method: 'POST',
      body,
    });
  } catch {
    throw new Error(
      `Server से कनेक्ट नहीं हो पाया (${API_URL})। Backend चल रहा है और फोन-कंप्यूटर एक ही Wi-Fi पर हैं?`
    );
  }
  voicePerf('upload completed', uploadStartedAt);

  let json: { success?: boolean; data?: { transcript?: string }; message?: string };
  try {
    json = (await res.json()) as typeof json;
  } catch {
    throw new Error(`Server ने गलत response दिया (${res.status})। क्या ${API_URL} backend है?`);
  }
  voicePerf('frontend response received', uploadStartedAt);

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Speech service ने error दिया (${res.status})`);
  }

  const text = json.data?.transcript?.trim();
  if (!text) {
    throw new Error('कुछ भी सुनाई नहीं दिया। फिर से बोलकर कोशिश करें।');
  }
  return text;
}
