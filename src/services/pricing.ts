import type { ProductState } from '@/types/product';
import type { MarketPricing } from '@/types/pricing';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

const PRICING_PATH = '/api/products/pricing';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface GetMarketPricingInput {
  product: ProductState;
  language: string;
}

/**
 * Request market-reference pricing from the backend.
 *
 * Returns null on ANY failure (network / backend / missing URL) so the caller
 * can keep product creation flowing with a demo-safe message. Pricing never
 * blocks the flow.
 */
export async function getMarketPricing(input: GetMarketPricingInput): Promise<MarketPricing | null> {
  if (!API_URL) return null;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${PRICING_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: input.product,
        language: input.language,
      }),
    });
  } catch {
    return null;
  }

  let json: ApiEnvelope<MarketPricing>;
  try {
    json = (await response.json()) as ApiEnvelope<MarketPricing>;
  } catch {
    return null;
  }

  if (!response.ok || !json.success || !json.data) return null;
  return json.data;
}
