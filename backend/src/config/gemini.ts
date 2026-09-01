import { config } from './env';

/**
 * Backend-only Gemini configuration + failover layer.
 *
 * Resolves the ordered list of API keys to try and the model for each kind of
 * request, then runs a single request against the next key whenever the current
 * key reports a transient/quota failure (HTTP 429 / 503 or a Gemini
 * RESOURCE_EXHAUSTED / rate-limit style error).
 *
 * Keys are NEVER exposed: callers receive only the key to place in the header,
 * and logs reference key position ("key 1"), never the key value.
 */

/**
 * Ordered list of API keys to use, highest preference first.
 * - Uses GEMINI_API_KEY_1 .. GEMINI_API_KEY_5 (preferred order), ignoring
 *   empty/unset values.
 * - Falls back to the legacy GEMINI_API_KEY if no numbered keys exist.
 */
export function getGeminiApiKeys(): string[] {
  const numbered: string[] = [];
  for (let i = 1; i <= 5; i += 1) {
    const candidate = process.env[`GEMINI_API_KEY_${i}`];
    if (typeof candidate === 'string' && candidate.trim()) {
      numbered.push(candidate.trim());
    }
  }
  if (numbered.length > 0) return numbered;

  const legacy = config.geminiApiKey.trim();
  return legacy ? [legacy] : [];
}

/** Model used for product analysis requests. */
export function getProductModel(): string {
  return process.env.GEMINI_PRODUCT_MODEL?.trim() || config.geminiModel;
}

/** Model used for speech transcription requests. */
export function getSpeechModel(): string {
  return process.env.GEMINI_SPEECH_MODEL?.trim() || config.geminiSpeechModel;
}

/** True when an error clearly indicates the current key/project is quota-limited. */
export function isTransientFailure(status: number | undefined, body: string): boolean {
  if (status === 429 || status === 503) return true;
  if (!body) return false;
  return /RESOURCE_EXHAUSTED|quota|rate.?limit|temporar(?:y|ily)/i.test(body);
}

export interface GeminiRequestError {
  /** HTTP status from Gemini, when available. */
  readonly status?: number;
  /** Raw error body from Gemini (truncated for logs). */
  readonly body: string;
  /** Whether the error qualifies for key failover. */
  readonly transient: boolean;
}

/**
 * Runs `execute` against each key in order, stopping after the first success.
 * Only fails over on transient/quota failures. Non-transient errors (invalid
 * request, invalid key, malformed input) are rethrown immediately. If every key
 * fails transiently, the last error is rethrown (preserving HTTP status).
 *
 * @param operation  Human-readable label used only in logs (e.g. "product", "speech").
 * @param execute    Performs one request with the given key; returns parsed result.
 */
export async function runGeminiWithFailover<T>(
  operation: 'product' | 'speech',
  execute: (apiKey: string) => Promise<T>
): Promise<T> {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) {
    // No keys configured per key-configuration; let the caller decide how to
    // surface this based on the operation's own conventions.
    throw {
      status: 500,
      body: `${operation} Gemini not configured: no API keys available`,
      transient: false,
    } as GeminiRequestError;
  }

  let lastError: unknown;
  for (let i = 0; i < keys.length; i += 1) {
    try {
      const result = await execute(keys[i]);
      if (i > 0) {
        console.log(
          `[GEMINI FAILOVER] ${operation} attempt ${i + 1} succeeded after transient failures`
        );
      }
      return result;
    } catch (error) {
      lastError = error;
      const isTransient = isGeminiRequestError(error) && error.transient;
      if (!isTransient) {
        throw error;
      }
      const status = isGeminiRequestError(error) ? error.status : undefined;
      const code = isGeminiRequestError(error)
        ? extractErrorCode(error.body)
        : undefined;
      if (i < keys.length - 1) {
        console.log(
          `[GEMINI FAILOVER] ${operation} attempt ${i + 1} failed: ${status ?? '?'}` +
            (code ? ` ${code}` : '') +
            `, switching to next configured key (attempt ${i + 2})`
        );
      } else {
        console.log(
          `[GEMINI FAILOVER] ${operation} attempt ${i + 1} failed: ${status ?? '?'}` +
            (code ? ` ${code}` : '') +
            ' — all configured keys exhausted'
        );
      }
    }
  }

  throw lastError;
}

/**
 * Pulls a short Gemini error code (e.g. RESOURCE_EXHAUSTED) out of an error
 * body for logging only. Never logs the API key or other secrets.
 */
function extractErrorCode(body: string): string | undefined {
  const match = /RESOURCE_EXHAUSTED|RATE_LIMIT_EXCEEDED|UNAVAILABLE|PERMISSION_DENIED|INVALID_ARGUMENT/i.exec(
    body
  );
  return match ? match[0] : undefined;
}

/** Narrowing helper for the error shape produced above. */
export function isGeminiRequestError(error: unknown): error is GeminiRequestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'transient' in error &&
    typeof (error as { transient?: unknown }).transient === 'boolean'
  );
}
