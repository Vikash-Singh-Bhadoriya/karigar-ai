import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import { getProducts, getCategories } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        search: search || undefined,
        category: selectedCategory || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        limit: 20,
      });
      setProducts(res.products);
      setTotal(res.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const applyFilters = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Browse Products</h1>
      <p className="text-stone-500 mb-8">हस्तनिर्मित प्रोडक्ट्स ब्राउज़ करें</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 p-5 sticky top-20">
            <h3 className="font-semibold text-stone-900 mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-1 block">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search products..."
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Categories */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-2 block">Category</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded ${
                    !selectedCategory ? 'bg-amber-100 text-amber-800 font-medium' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-sm px-2 py-1 rounded ${
                      selectedCategory === cat
                        ? 'bg-amber-100 text-amber-800 font-medium'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-2 block">Price Range (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors mb-2"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full text-stone-500 hover:text-stone-700 py-1 text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <p className="text-sm text-stone-500 flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                Loading products...
              </p>
            ) : (
              <p className="text-sm text-stone-500">
                {total} product{total !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {loading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="status"
              aria-live="polite"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-[#FFFCF8] rounded-2xl overflow-hidden shadow-md border border-amber-100 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <div className="h-4 w-20 bg-stone-200 rounded-md" />
                    <div className="h-5 w-3/4 bg-stone-200 rounded-md" />
                    <div className="h-5 w-1/2 bg-stone-200 rounded-md" />
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <div className="h-6 w-16 bg-amber-200 rounded-md" />
                      <div className="h-4 w-20 bg-stone-200 rounded-md" />
                    </div>
                    <div className="h-10 w-full bg-stone-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-xl font-semibold text-stone-700 mb-2">No products found</h3>
              <p className="text-stone-500">कोई प्रोडक्ट नहीं मिला। दूसरे फ़िल्टर आज़माएं।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
