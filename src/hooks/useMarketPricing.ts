import { useEffect, useState } from 'react';
import type { ProductState } from '@/types/product';
import type { MarketPricing } from '@/types/pricing';
import { getMarketPricing } from '@/services/pricing';

export type PricingState = 'loading' | 'ready' | 'unavailable';

/**
 * Fetch evidence-based market-reference pricing for the current product.
 *
 * Demo-safe: on ANY failure the state becomes 'unavailable' (never throws),
 * so the UI can show a fallback message and let the artisan keep pricing
 * manually without blocking product creation.
 */
export function useMarketPricing(product: ProductState | null): {
  pricing: MarketPricing | null;
  state: PricingState;
} {
  const [pricing, setPricing] = useState<MarketPricing | null>(null);
  const [state, setState] = useState<PricingState>('unavailable');

  const key = product ? `${product.name}|${product.category}|${product.price}` : '';

  useEffect(() => {
    if (!product) {
      setPricing(null);
      setState('unavailable');
      return;
    }
    let cancelled = false;
    setState('loading');
    setPricing(null);
    getMarketPricing({ product, language: product.language ?? 'हिंदी' }).then((result) => {
      if (cancelled) return;
      setPricing(result);
      setState(result ? 'ready' : 'unavailable');
    });
    return () => {
      cancelled = true;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { pricing, state };
}
