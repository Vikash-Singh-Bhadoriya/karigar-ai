/**
 * Provider registry for real marketplace comparable search.
 *
 * No live marketplace API credentials exist in the repository, so no provider
 * is registered. A future provider (Flipkart Affiliate, Amazon PA-API, etc.)
 * can be added here behind the MarketPricingProvider interface with its
 * credentials read from environment variables on the backend only.
 */
import type { ComparableProduct, MarketPricingProvider } from '../../../types/pricing';
import type { ProductState } from '../../../types/product';

export const pricingProviders: MarketPricingProvider[] = [];

/**
 * Try every registered provider and merge real comparable results from the
 * first provider that returns any. Providers may throw (network/rate-limit);
 * callers treat an empty result as "no live market data".
 */
export async function searchComparables(product: ProductState): Promise<ComparableProduct[]> {
  for (const provider of pricingProviders) {
    try {
      const items = await provider.searchComparables(product);
      if (items && items.length > 0) return items;
    } catch {
      // A failing provider should never block pricing — move to the next one.
      continue;
    }
  }
  return [];
}
