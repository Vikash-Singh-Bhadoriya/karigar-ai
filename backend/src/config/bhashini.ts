/**
 * Government of India - Digital India Bhashini (NLTM) Integration
 * Provides open Indic ASR (Speech-to-Text), NMT (Translation), and TTS (Speech Synthesis)
 * across all 22 Official Scheduled Languages of India.
 * 
 * Free & open public digital infrastructure for Indian innovations.
 */

export interface BhashiniConfig {
  userId?: string;
  apiKey?: string;
  pipelineId?: string;
  inferenceUrl?: string;
}

export function getBhashiniConfig(): BhashiniConfig {
  return {
    userId: process.env.BHASHINI_USER_ID,
    apiKey: process.env.BHASHINI_API_KEY,
    pipelineId: process.env.BHASHINI_PIPELINE_ID,
    inferenceUrl: process.env.BHASHINI_INFERENCE_URL || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
  };
}

export function isBhashiniConfigured(): boolean {
  const cfg = getBhashiniConfig();
  return Boolean(cfg.userId && cfg.apiKey && cfg.pipelineId);
}

/**
 * Transcribes audio via Bhashini ASR pipeline for Indian languages.
 * Returns null if Bhashini is not configured or if the inference fails,
 * triggering the failover to Gemini.
 */
export async function transcribeWithBhashini(
  audioBase64: string,
  sourceLanguage: string
): Promise<string | null> {
  const cfg = getBhashiniConfig();
  if (!isBhashiniConfigured()) {
    return null;
  }

  try {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: {
              sourceLanguage: sourceLanguage.toLowerCase().slice(0, 2),
            },
            audioFormat: 'm4a',
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [
          {
            audioContent: audioBase64,
          },
        ],
      },
    };

    const response = await fetch(cfg.inferenceUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cfg.apiKey!,
        userId: cfg.userId!,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`[Bhashini] ASR request failed (${response.status}), failing over to Gemini`);
      return null;
    }

    const json = (await response.json()) as {
      pipelineResponse?: Array<{
        output?: Array<{ source?: string }>;
      }>;
    };

    const transcript = json.pipelineResponse?.[0]?.output?.[0]?.source?.trim();
    return transcript || null;
  } catch (error) {
    console.warn('[Bhashini] ASR exception, falling back to secondary provider', error);
    return null;
  }
}
