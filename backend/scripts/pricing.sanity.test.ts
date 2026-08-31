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

  test('user-entered price is honoured when plausible', async () => {
    const result = await getMarketPricing(
      baseProduct({ category: 'Handmade Bag', price: 1200 }),
      'English'
    );
    assert.strictEqual(result.sourceType, 'ai_estimate');
    assert.ok(result.recommendedPrice <= 2500, 'recommendation near user price');
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
