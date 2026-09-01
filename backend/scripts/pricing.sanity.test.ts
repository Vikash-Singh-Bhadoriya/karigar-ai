/**
 * Sanity + correctness tests for the market-reference pricing engine.
 *
 * Run:   cd backend && npm run test:pricing
 * These are assertion-based (Pokemon-style) — no external framework needed.
 */

import assert from 'assert';
import { getMarketPricing } from '../src/services/pricing/marketPricing.service';
import type { ProductState } from '../src/types/product';

const failures: string[] = [];
const pending: Array<Promise<void>> = [];

function test(name: string, fn: () => void | Promise<void>): void {
  try {
    const r = fn();
    if (r && typeof (r as Promise<void>).then === 'function') {
      pending.push(
        (r as Promise<void>)
          .then(() => console.log(`  ✓ ${name}`))
          .catch((e) => {
            failures.push(`${name}: ${(e as Error).message}`);
          })
      );
    } else {
      console.log(`  ✓ ${name}`);
    }
  } catch (e) {
    failures.push(`${name}: ${(e as Error).message}`);
  }
}

function baseProduct(over: Partial<ProductState> = {}): ProductState {
  return {
    name: 'Test product',
    category: 'Handmade Bag',
    description: 'A handmade cotton tote bag',
    materials: ['Cotton'],
    tags: ['handmade', 'bag'],
    weight: '500 g',
    dimensions: '30 x 40 cm',
    price: null,
    confidence: {},
    ...over,
  };
}

async function main(): Promise<void> {
  console.log('market-reference pricing engine tests');

  test('never fabricates comparableProducts when no live provider', async () => {
    const result = await getMarketPricing(baseProduct(), 'English');
    assert.strictEqual(result.marketAvailable, false);
    assert.strictEqual(result.comparableProducts.length, 0, 'comparableProducts must be empty');
    assert.ok(result.available, 'must always be available (demo-safe)');
    assert.ok(result.recommendedPrice > 0, 'recommendedPrice must be positive');
  });

  test('sanity check rejects absurd AI price for electronics', () => {
    const price = require('../src/services/pricing/marketPricing.service').sanityCheckPrice;
    const laptop = baseProduct({ category: 'Laptop', name: 'Laptop' });
    // ₹550 for a laptop is absurd -> rejected (null)
    assert.strictEqual(price(550, laptop), null);
    // ₹45000 for a laptop is plausible
    assert.strictEqual(price(45000, laptop), 45000);
  });

  test('sanity check accepts valid artisan prices', () => {
    const price = require('../src/services/pricing/marketPricing.service').sanityCheckPrice;
    const potli = baseProduct({ category: 'Potli Bag' });
    // ₹450 potli is reasonable
    assert.strictEqual(price(450, potli), 450);
    // Negative / NaN rejected
    assert.strictEqual(price(-5, potli), null);
    assert.strictEqual(price(NaN, potli), null);
    assert.strictEqual(price(0, potli), null);
  });

  test('category window does not clip artisan potli to universal bounds', async () => {
    // A small potli bag estimate should be in the hundreds, not forced to ₹500+.
    const result = await getMarketPricing(
      baseProduct({ category: 'Potli', name: 'Silk Potli Bag' }),
      'English'
    );
    assert.ok(result.recommendedPrice < 2500, 'potli estimate should stay low');
  });

  test('handmade items are not priced at arbitrary low global bounds', async () => {
    const result = await getMarketPricing(
      baseProduct({ category: 'Decorative Wall Hanging' }),
      'English'
    );
    assert.ok(result.recommendedPrice > 0);
  });

  test('Hindi explanation mentions it is an estimate, not live market', async () => {
    const result = await getMarketPricing(baseProduct(), 'हिंदी');
    assert.ok(result.explanation.includes('अनुमानित मूल्य'), 'explanation should note estimate');
    assert.ok(!result.explanation.includes('undefined'), 'no undefined text');
  });

  test('market reference is independent of seller price (lakh bangles)', async () => {
    const lakhBangles = (price: number | null) =>
      baseProduct({
        category: 'Bangles',
        name: 'लाख की चूड़ियाँ',
        description: 'हाथ से बनी लाख की चूड़ियाँ, 125 g',
        materials: ['Lac'],
        weight: '125 g',
        price,
      });

    const r280 = await getMarketPricing(lakhBangles(280), 'English');
    const r350 = await getMarketPricing(lakhBangles(350), 'English');
    const r90000 = await getMarketPricing(lakhBangles(90000), 'English');

    assert.ok(r280.available, 'bangles must have a market reference');
    assert.strictEqual(r280.sourceType, 'category_reference');
    // ₹280, ₹350 and ₹90,000 must all yield the SAME market reference.
    assert.strictEqual(r350.recommendedMin, r280.recommendedMin);
    assert.strictEqual(r350.recommendedMax, r280.recommendedMax);
    assert.strictEqual(r350.recommendedPrice, r280.recommendedPrice);
    assert.strictEqual(r90000.recommendedMin, r280.recommendedMin);
    assert.strictEqual(r90000.recommendedMax, r280.recommendedMax);
    assert.strictEqual(r90000.recommendedPrice, r280.recommendedPrice);
  });

  test('market reference is independent of seller price (handmade bag)', async () => {
    const bag = () => baseProduct({});
    const rNone = await getMarketPricing(bag(), 'English');
    const r700 = await getMarketPricing({ ...bag(), price: 700 }, 'English');
    const r99999 = await getMarketPricing({ ...bag(), price: 99999 }, 'English');

    assert.strictEqual(r700.recommendedMin, rNone.recommendedMin);
    assert.strictEqual(r700.recommendedMax, rNone.recommendedMax);
    assert.strictEqual(r700.recommendedPrice, rNone.recommendedPrice);
    assert.strictEqual(r99999.recommendedMin, rNone.recommendedMin);
    assert.strictEqual(r99999.recommendedMax, rNone.recommendedMax);
    assert.strictEqual(r99999.recommendedPrice, rNone.recommendedPrice);
  });

  test('bangles/lakh bangles give a realistic reference, not thousands', async () => {
    const result = await getMarketPricing(
      baseProduct({
        category: 'Bangles',
        name: 'लाख की चूड़ियाँ',
        description: 'हाथ से बनी लाख की चूड़ियाँ, 125 g',
        materials: ['Lac'],
        weight: '125 g',
        price: 280,
      }),
      'English'
    );
    assert.ok(result.available);
    assert.strictEqual(result.sourceType, 'category_reference');
    assert.ok(result.recommendedPrice > 0, 'recommendedPrice must be positive');
    assert.ok(result.recommendedPrice < 1100, 'lakh bangles must stay in the bangles band');
    assert.ok(result.recommendedMax < 2000, 'range must not explode to thousands');
  });

  test('unknown category stays honest: available:false, no fabricated range', async () => {
    const result = await getMarketPricing(
      baseProduct({
        category: 'Quantum Levitation Drone',
        name: 'Unmatched Thing',
        description: 'glorp bloop zzzz no known artisan keyword here',
        materials: [],
        tags: [],
      }),
      'English'
    );
    assert.strictEqual(result.available, false);
    assert.strictEqual(result.sourceType, 'unavailable');
    assert.strictEqual(result.recommendedMin, 0);
    assert.strictEqual(result.recommendedMax, 0);
    assert.ok(
      result.explanation.includes('उपलब्ध नहीं') || result.explanation.includes('not available'),
      'explanation must stay honest about missing reference'
    );
  });

  console.log('\nDone.');
  await Promise.all(pending);
  if (failures.length > 0) {
    console.error(`\n${failures.length} assertion(s) failed:`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log('All tests passed.');
}

void main();
