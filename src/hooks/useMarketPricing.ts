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

  // The market reference depends ONLY on the product's own attributes.
  // The seller's price is excluded from the key and stripped before the
  // request, so editing the seller price never recomputes / re-fetches it.
  const key = product
    ? `${product.name}|${product.category}|${(product.materials ?? []).join(',')}|${product.weight}|${product.dimensions}|${product.description}|${product.language ?? ''}`
    : '';

  useEffect(() => {
    if (!product) {
      setPricing(null);
      setState('unavailable');
      return;
    }
    let cancelled = false;
    setState('loading');
    setPricing(null);
    getMarketPricing({
      product: { ...product, price: null },
      language: product.language ?? 'हिंदी',
    }).then((result) => {
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
