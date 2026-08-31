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
  available: boolean;
}
