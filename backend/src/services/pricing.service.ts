/**
 * Pricing service (replaced). The previous hardcoded 299–999 recommendation
 * was removed. All real pricing logic now lives in
 * ./pricing/marketPricing.service.ts (evidence-based market-reference engine).
 */
import { getMarketPricing } from './pricing/marketPricing.service';
export { getMarketPricing };
export type { MarketPricing, ComparableProduct, PricingSourceType, PricingConfidence } from '../types/pricing';

/** Backward-compatible thin wrapper for the legacy (productName, category) call. */
export async function getPriceRecommendation(
  productName: string,
  category: string
): Promise<{
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  currency: string;
  marketAvailable: boolean;
}> {
  const result = await getMarketPricing({ name: productName, category } as never);
  return {
    minPrice: result.recommendedMin,
    maxPrice: result.recommendedMax,
    suggestedPrice: result.recommendedPrice,
    currency: result.currency,
    marketAvailable: result.marketAvailable,
  };
}
