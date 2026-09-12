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

export interface FairTradeBreakdown {
  artisanDirectEarning: number;
  artisanPercent: number;
  materialCostEstimate: number;
  materialPercent: number;
  packagingLogisticsEstimate: number;
  packagingPercent: number;
  laborHoursEstimated: number;
  hourlyWageBenchmark: number;
  exportBenchmarkUSD: { min: number; max: number };
  exploitationWarning?: string;
  livingWageVerified: boolean;
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
  fairTrade?: FairTradeBreakdown;
}
