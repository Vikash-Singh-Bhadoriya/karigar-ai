/**
 * Curated category price references (INR) used as an internal plausibility
 * anchor for a product category.
 *
 * Important:
 * - This is NOT live market data and is NEVER surfaced as comparableProducts.
 * - It is a conservative per-category range used to (a) build an explainable
 *   estimate and (b) sanity-check AI/user numbers so absurd values like ₹550
 *   for a laptop are rejected.
 * - Ranges are intentionally wide so artisan products are not broken by an
 *   arbitrary low cap.
 */
import type { CategoryPriceReference } from '../../types/pricing';

interface CategoryRefInternal extends CategoryPriceReference {
  /** Words that match when they appear in the explicit category field. */
  categoryWords: string[];
  /** Phrases/words that match only as a weaker fallback (name/description). */
  fallbackWords: string[];
}

const REFERENCES: CategoryRefInternal[] = [
  { category: 'laptop', baseMin: 25000, baseMax: 150000, categoryWords: ['laptop', 'notebook', 'macbook'], fallbackWords: ['laptop', 'notebook', 'macbook'] },
  { category: 'mobile', baseMin: 7000, baseMax: 120000, categoryWords: ['mobile', 'phone', 'smartphone'], fallbackWords: ['phone', 'mobile', 'smartphone'] },
  { category: 'electronics', baseMin: 5000, baseMax: 60000, categoryWords: ['tv', 'television', 'speaker', 'headphone', 'earbud', 'camera', 'electronics'], fallbackWords: ['tv', 'speaker', 'headphone', 'earbud', 'camera'] },
  { category: 'saree', baseMin: 500, baseMax: 15000, categoryWords: ['saree', 'sari'], fallbackWords: ['saree', 'sari', 'silk saree'] },
  { category: 'dupatta', baseMin: 250, baseMax: 8000, categoryWords: ['dupatta', 'stole', 'scarf'], fallbackWords: ['dupatta', 'stole', 'scarf'] },
  { category: 'bag', baseMin: 200, baseMax: 4000, categoryWords: ['bag', 'handbag', 'tote', 'sling', 'backpack'], fallbackWords: ['handbag', 'tote', 'sling', 'backpack', 'messenger'] },
  { category: 'potli', baseMin: 100, baseMax: 2500, categoryWords: ['potli', 'clutch', 'pouch'], fallbackWords: ['potli', 'clutch', 'pouch'] },
  { category: 'quilt', baseMin: 500, baseMax: 12000, categoryWords: ['quilt', 'rajai', 'kantha', 'blanket', 'comforter'], fallbackWords: ['quilt', 'rajai', 'kantha', 'blanket', 'comforter'] },
  { category: 'jewellery', baseMin: 400, baseMax: 30000, categoryWords: ['jewellery', 'jewelry', 'necklace', 'earring', 'bangle', 'bracelet'], fallbackWords: ['necklace', 'earring', 'bangle', 'bracelet', 'mala', 'bali'] },
  { category: 'pottery', baseMin: 150, baseMax: 6000, categoryWords: ['pottery', 'ceramic', 'terracotta', 'clay'], fallbackWords: ['pot', 'vase', 'clay pot', 'terracotta', 'ceramic'] },
  { category: 'home', baseMin: 200, baseMax: 15000, categoryWords: ['home', 'decor', 'cushion', 'pillow', 'lamp', 'rug'], fallbackWords: ['cushion', 'pillow', 'lamp', 'candle', 'rug'] },
  { category: 'clothing', baseMin: 200, baseMax: 8000, categoryWords: ['clothing', 'kurta', 'dress', 'shirt', 'lehenga', 'garment', 'fabric'], fallbackWords: ['kurta', 'dress', 'shirt', 'lehenga', 'top', 'garment'] },
  { category: 'footwear', baseMin: 250, baseMax: 8000, categoryWords: ['footwear', 'shoe', 'chappal', 'sandal', 'juti'], fallbackWords: ['shoe', 'chappal', 'sandal', 'juti'] },
  { category: 'furniture', baseMin: 1000, baseMax: 60000, categoryWords: ['furniture', 'chair', 'table', 'stool', 'sofa', 'shelf'], fallbackWords: ['chair', 'table', 'stool', 'sofa', 'shelf'] },
  { category: 'decoration', baseMin: 150, baseMax: 8000, categoryWords: ['decoration', 'showpiece', 'wall art', 'hanging', 'toran'], fallbackWords: ['showpiece', 'wall', 'hanging', 'toran'] },
];

const DEFAULT_REFERENCE: CategoryPriceReference = {
  category: 'general',
  baseMin: 150,
  baseMax: 12000,
};

function normalize(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Longest-word-match tiebreak so a clear category wins over a generic phrase.
 * Higher = stronger match.
 */
function score(ref: CategoryRefInternal, category: string, name: string, description: string): number {
  const cat = normalize(category);
  const free = normalize(`${name} ${description}`);
  let score = 0;

  // A distinctive word in the explicit category field is the strongest signal.
  for (const w of ref.categoryWords) {
    if (cat && cat.split(/\s+/).some((tok) => tok.includes(w) || w.includes(tok) || tok.startsWith(w))) {
      score = Math.max(score, 100 + w.length);
    }
  }
  // Fallback: distinctive word appearing in the name/description.
  if (score === 0) {
    for (const w of ref.fallbackWords) {
      if (free && free.includes(w)) score = Math.max(score, 10 + w.length);
    }
  }
  return score;
}

/** Match a free-text category name (and product name/description) to a reference. */
export function resolveCategoryReference(
  category: string,
  name = '',
  description = ''
): CategoryPriceReference {
  let best: CategoryRefInternal | null = null;
  let bestScore = 0;
  for (const ref of REFERENCES) {
    const s = score(ref, category, name, description);
    if (s > bestScore) {
      bestScore = s;
      best = ref;
    }
  }
  if (best && bestScore >= 3) {
    return { category: best.category, baseMin: best.baseMin, baseMax: best.baseMax };
  }
  return DEFAULT_REFERENCE;
}
