import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import type { Language } from '@/types/product';
import { toSpeechLocale } from '@/services/speech';

const SPEECH_RATE = 0.95;

/** Re-enter playback audio mode so TTS never routes through a leftover recording session. */
async function preparePlaybackMode(): Promise<void> {
  try {
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
  } catch {
    // Non-fatal: speech still attempts to play.
  }
}

/** Stop any currently playing/queued speech. Safe to call anytime. */
export function stopSpeech(): void {
  Speech.stop().catch((err) => {
    console.log('[TTS] stop failed', err);
  });
}

/** Speak text aloud once in the given app language. Never throws; failures are logged only. */
export async function speakText(text: string, language: Language): Promise<void> {
  const message = text.trim();
  if (!message) return;
  stopSpeech();
  await preparePlaybackMode();
  console.log(
    '[TTS] speaking',
    JSON.stringify(message.slice(0, 60)),
    '→',
    toSpeechLocale(language)
  );
  const options: Speech.SpeechOptions = {
    language: toSpeechLocale(language),
    rate: SPEECH_RATE,
    pitch: 1,
    onError: (error) => {
      console.log('[TTS] speech error', error.message);
    },
  };
  try {
    Speech.speak(message, options);
  } catch (err) {
    console.log('[TTS] speak call failed', err);
  }
}