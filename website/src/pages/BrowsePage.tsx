import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import { getProducts, getCategories } from '../api/client';
import ProductCard from '../components/ProductCard';
import { useWebLanguage } from '../context/LanguageContext';

export default function BrowsePage() {
  const { t, translateCategory } = useWebLanguage();
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
      <h1 className="text-3xl font-bold text-stone-900 mb-2">{t.browseTitle}</h1>
      <p className="text-stone-500 mb-8">{t.browseSubtitle}</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 p-5 sticky top-20">
            <h3 className="font-semibold text-stone-900 mb-4">{t.filters}</h3>

            {/* Search */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-1 block">{t.searchLabel}</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder={t.searchPlaceholder}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Categories */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-2 block">{t.categoryLabel}</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left text-sm px-2 py-1 rounded ${
                    !selectedCategory ? 'bg-amber-100 text-amber-800 font-medium' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {t.allCategories}
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
                    {translateCategory(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="text-sm font-medium text-stone-600 mb-2 block">{t.priceRange}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={t.minPrice}
                  className="w-1/2 border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={t.maxPrice}
                  className="w-1/2 border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors mb-2 cursor-pointer"
            >
              {t.applyFilters}
            </button>
            <button
              onClick={clearFilters}
              className="w-full text-stone-500 hover:text-stone-700 py-1 text-sm transition-colors cursor-pointer"
            >
              {t.clearAll}
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-stone-500 font-medium">
              {total} {t.productsFound}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
              <p className="text-stone-500 mt-4">{t.loadingProducts}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-xl font-semibold text-stone-700 mb-2">{t.noProductsFound}</h3>
              <p className="text-stone-500">{t.noProductsSub}</p>
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
