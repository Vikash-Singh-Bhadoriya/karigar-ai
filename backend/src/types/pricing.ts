/**
 * Backend pricing domain types. Shared between the pricing service, providers,
 * and the /api/products/pricing endpoint.
 */
import type { ProductState } from '../types/product';

export type PricingSourceType =
  | 'market_reference'
  | 'category_reference'
  | 'ai_estimate'
  | 'unavailable';

export type PricingConfidence = 'high' | 'medium' | 'low';

export interface ComparableProduct {
  title: string;
  price: number;
  source: string;
  url?: string;
}

export interface MarketPricing {
  currency: 'INR';
  marketAvailable: boolean;
  confidence: PricingConfidence;
  sourceType: PricingSourceType;
  comparableProducts: ComparableProduct[];
  observedMin?: number;
  observedMax?: number;
  recommendedMin: number;
  recommendedMax: number;
  recommendedPrice: number;
  explanation: string;
  /** Whether at least a usable recommendation exists (never blocks creation). */
  available: boolean;
}

/**
 * A pluggable source of real comparable market listings.
 *
 * Implementations MUST return only prices that came from a real API response.
 * They MUST NOT fabricate listings. When no live provider is configured, the
 * engine routes to the category-reference / AI-estimate fallback.
 */
export interface MarketPricingProvider {
  readonly id: string;
  searchComparables(product: ProductState): Promise<ComparableProduct[]>;
}

/** Price range in INR used as a category plausibility/estimate anchor. */
export interface CategoryPriceReference {
  category: string;
  /** Reasonable lower bound for a typical item of this category (INR). */
  baseMin: number;
  /** Reasonable upper bound for a typical item of this category (INR). */
  baseMax: number;
}
