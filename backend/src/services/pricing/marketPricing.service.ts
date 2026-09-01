/**
 * Evidence-based market-reference pricing engine.
 *
 * Pipeline:
 *   1. Ask registered live market providers for comparable real listings.
 *   2. If genuine comparables exist -> derive observed range + recommendation
 *      from that evidence (sourceType = market_reference).
 *   3. Otherwise fall back to a clearly-labelled estimate anchored on a
 *      per-category reference and the product's own attributes
 *      (sourceType = category_reference / ai_estimate).
 *   4. A sanity-check layer rejects absurd AI/user numbers relative to the
 *      category reference instead of displaying them blindly.
 *
 * The service NEVER fabricates comparableProducts or live market prices.
 */
import type {
  ComparableProduct,
  MarketPricing,
  PricingConfidence,
} from '../../types/pricing';
import type { ProductState } from '../../types/product';
import { resolveCategoryReference } from './categoryReference';
import { searchComparables } from './providers/providerRegistry';

const CURRENCY = 'INR' as const;

interface PlausibleRange {
  min: number;
  max: number;
}

/** Multiply category bounds outward to form a plausibility window for sanity checks. */
function plausibilityWindow(ref: PlausibleRange, factor: number): PlausibleRange {
  return { min: Math.round(ref.min / factor), max: Math.round(ref.max * factor) };
}

function isHandmade(product: ProductState): boolean {
  const text = [product.name, product.category, product.description, ...(product.tags ?? [])]
    .join(' ')
    .toLowerCase();
  return /handmade|hand ?craft|hand ?woven|hand ?knit|artisan|custom|heritage/gi.test(text);
}

function parseDimension(product: ProductState): number | null {
  const m = /(\d+(?:\.\d+)?)\s*(cm|inch|in|mm)/i.exec((product.dimensions ?? '').toString());
  if (!m) return null;
  const val = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'mm') return val / 10;
  if (unit === 'inch' || unit === 'in') return val * 2.54;
  return val; // cm
}

function parseWeightGrams(product: ProductState): number | null {
  const w = (product.weight ?? '').toString().toLowerCase();
  const g = /(\d+(?:\.\d+)?)\s*(kg|g|gm|gram)/.exec(w);
  if (!g) return null;
  const val = parseFloat(g[1]);
  if (g[2] === 'kg') return val * 1000;
  return val; // grams
}

/** Reflect material quality/premium in a multiplier (capped). */
function materialMultiplier(product: ProductState): number {
  const mats = (product.materials ?? []).join(' ').toLowerCase();
  let m = 1;
  if (/silk|wool|leather|linen|kantha|zari|gold|silver|brocade/.test(mats)) m += 0.3;
  if (/cotton|jute|clay|terracotta|wood|bamboo/.test(mats)) m += 0.1;
  return m;
}

function attributeFactor(product: ProductState): number {
  let f = 1;
  if (isHandmade(product)) f += 0.25;
  f *= materialMultiplier(product);

  const size = parseDimension(product);
  if (size) {
    if (size > 80) f += 0.15; // larger pieces
    else if (size < 20) f += 0.05;
  }

  const grams = parseWeightGrams(product);
  if (grams && grams > 800) f += 0.1; // heavier = more material
  return Math.min(f, 2.2);
}

/** Base estimate from the per-category reference (no live data). */
function categoryBaseEstimate(ref: { min: number; max: number }): number {
  return Math.round((ref.min + ref.max) / 2);
}

/**
 * Build an explainable estimate from the category reference and the product's
 * OWN attributes ONLY.
 *
 * The seller's asking price (product.price) is deliberately NOT an input:
 * the market reference is a property of the product/category, so changing the
 * seller's price must never re-anchor the range.
 */
function buildEstimate(product: ProductState): {
  min: number;
  max: number;
  anchor: number;
} | null {
  const ref = resolveCategoryReference(product.category, product.name, product.description);
  if (!ref) return null;
  const base = categoryBaseEstimate({ min: ref.baseMin, max: ref.baseMax });
  const factor = attributeFactor(product);

  let anchor = Math.round(base * factor);
  // Keep the anchor inside the reference window so artisan items aren't inflated
  // beyond their category's plausible range.
  anchor = Math.min(Math.max(anchor, ref.baseMin), Math.round(ref.baseMax * 1.15));

  const span = Math.max(10, Math.round(anchor * 0.18));
  return { min: Math.max(1, anchor - span), max: anchor + span, anchor };
}

/**
 * Sanity check: reject a candidate value that is absurd relative to the
 * product category. Returns null if the candidate should be discarded.
 */
export function sanityCheckPrice(
  candidate: number,
  product: ProductState
): number | null {
  if (!Number.isFinite(candidate) || candidate <= 0) return null;
  const ref = resolveCategoryReference(product.category, product.name, product.description);
  if (!ref) return null;
  const window = plausibilityWindow({ min: ref.baseMin, max: ref.baseMax }, 8);
  if (candidate < window.min || candidate > window.max) return null;
  return Math.round(candidate);
}

function roundToNearest10(n: number): number {
  return Math.round(n / 10) * 10;
}

/** Confidence is about the REFERENCE, never the seller's own price. */
function confidence(fromMarket: boolean): PricingConfidence {
  return fromMarket ? 'high' : 'medium';
}

/** Explain the recommendation in the artisan's language (Hindi default). */
function buildExplanation(
  pricing: MarketPricing,
  product: ProductState,
  hi: boolean
): string {
  const rupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  if (pricing.sourceType === 'unavailable' || !pricing.available) {
    return hi
      ? 'बाज़ार मूल्य उपलब्ध नहीं है — आप अपना मूल्य दर्ज कर सकते हैं।'
      : 'Market reference is not available for this product — you can enter your own price.';
  }

  if (pricing.sourceType === 'market_reference') {
    return hi
      ? `बाज़ार में मिलते-जुलते उत्पाद ${rupee(pricing.observedMin!)}–${rupee(pricing.observedMax!)} में मिले।${isHandmade(product) ? ' आपका उत्पाद हाथ से बना है।' : ''} इसलिए सुझाया गया मूल्य: ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)}।`
      : `Similar products in the market are ${rupee(pricing.observedMin!)}–${rupee(pricing.observedMax!)}.${isHandmade(product) ? ' Your product is handmade.' : ''} Recommended price: ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)}.`;
  }

  if (pricing.sourceType === 'category_reference') {
    return hi
      ? `यह अनुमानित मूल्य है, लाइव मार्केट डेटा नहीं। "${product.category || product.name}" श्रेणी के अनुसार और उत्पाद की सामग्री/आकार के आधार पर मूल्य ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)} सुझाया गया है।`
      : `This is an estimated price, not live market data. Based on the "${product.category || product.name}" category and product material/size, a price of ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)} is suggested.`;
  }

  // ai_estimate / unavailable
  return hi
    ? `यह अनुमानित मूल्य है, लाइव मार्केट डेटा नहीं। उत्पाद की जानकारी (श्रेणी, सामग्री, आकार) के आधार पर ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)} सुझाया गया है।`
    : `This is an estimated price, not live market data. Based on product info (category, material, size), ${rupee(pricing.recommendedMin)}–${rupee(pricing.recommendedMax)} is suggested.`;
}

export async function getMarketPricing(
  product: ProductState,
  language?: string
): Promise<MarketPricing> {
  const hi = !/en/i.test((language ?? '').trim());

  // 1) Live market path (only when a real provider returns genuine listings).
  let comparables: ComparableProduct[] = [];
  try {
    comparables = await searchComparables(product);
  } catch {
    comparables = [];
  }

  if (comparables.length > 0) {
    const observed = comparables.map((c) => c.price).filter((p) => Number.isFinite(p) && p > 0);
    const observedMin = Math.min(...observed);
    const observedMax = Math.max(...observed);
    // Recommendation is anchored on the observed range, pulled slightly toward
    // the middle, and sanity-checked against the category window.
    const rec = sanityCheckPrice(Math.round((observedMin + observedMax) / 2), product);
    const ref = resolveCategoryReference(product.category, product.name, product.description) ?? {
      baseMin: observedMin,
      baseMax: observedMax,
    };
    const clampMin = Math.max(observedMin, Math.round(ref.baseMin / 8));
    const clampMax = Math.min(observedMax, Math.round(ref.baseMax * 2));

    const recommendedPrice = roundToNearest10(
      rec != null ? Math.min(Math.max(rec, clampMin * 0.9), clampMax * 1.1) : observedMin
    );
    const span = Math.round(recommendedPrice * 0.15);
    const recommendedMin = roundToNearest10(Math.max(1, recommendedPrice - span));
    const recommendedMax = roundToNearest10(recommendedPrice + span);

    const pricing: MarketPricing = {
      currency: CURRENCY,
      marketAvailable: true,
      confidence: 'high',
      sourceType: 'market_reference',
      comparableProducts: comparables,
      observedMin: roundToNearest10(observedMin),
      observedMax: roundToNearest10(observedMax),
      recommendedMin,
      recommendedMax,
      recommendedPrice,
      explanation: '',
      available: true,
    };
    pricing.explanation = buildExplanation(pricing, product, hi);
    return pricing;
  }

  // 2) Fallback: category-reference / AI estimate (clearly labelled).
  const est = buildEstimate(product);

  // No category reference exists for this product -> be honest, do not
  // fabricate a general range. The artisan can still enter their own price.
  if (!est) {
    const pricing: MarketPricing = {
      currency: CURRENCY,
      marketAvailable: false,
      confidence: 'low',
      sourceType: 'unavailable',
      comparableProducts: [],
      recommendedMin: 0,
      recommendedMax: 0,
      recommendedPrice: 0,
      explanation: '',
      available: false,
    };
    pricing.explanation = buildExplanation(pricing, product, hi);
    return pricing;
  }

  const sanity = sanityCheckPrice(est.anchor, product);
  const anchor = sanity != null ? sanity : est.anchor;

  const recommendedPrice = roundToNearest10(anchor);
  const span = Math.max(10, Math.round(recommendedPrice * 0.18));
  const recommendedMin = roundToNearest10(Math.max(1, recommendedPrice - span));
  const recommendedMax = roundToNearest10(recommendedPrice + span);

  const sourceType = 'category_reference';

  const pricing: MarketPricing = {
    currency: CURRENCY,
    marketAvailable: false,
    confidence: confidence(false),
    sourceType,
    comparableProducts: [],
    recommendedMin,
    recommendedMax,
    recommendedPrice,
    explanation: '',
    available: true,
  };
  pricing.explanation = buildExplanation(pricing, product, hi);
  return pricing;
}
