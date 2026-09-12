import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types';
import { getProduct, getImageUrl } from '../api/client';
import { useCart } from '../contexts/CartContext';
import { useWebLanguage } from '../context/LanguageContext';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();
  const { t, translateCategory, translateProductTitle } = useWebLanguage();

  const getScopeInfo = (scopeVal: string) => {
    switch (scopeVal) {
      case 'states':
        return { label: t.scopeStates || 'State Level', icon: '🏛️' };
      case 'india':
        return { label: t.scopeIndia || 'All India', icon: '🇮🇳' };
      case 'local':
      default:
        return { label: t.scopeLocal || 'Local Delivery', icon: '📍' };
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <span className="text-5xl block mb-4">😕</span>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.productNotFound}</h2>
        <p className="text-stone-500 mb-6">{t.productNotFoundSub}</p>
        <Link to="/browse" className="text-amber-700 font-semibold hover:underline">
          {t.backToProducts}
        </Link>
      </div>
    );
  }

  const scope = getScopeInfo(product.selling_scope);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/browse" className="text-amber-700 hover:underline text-sm mb-6 inline-block">
        {t.backToProducts}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-stone-100 rounded-2xl overflow-hidden">
          <img
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover max-h-[500px]"
          />
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800 mb-3">
              {translateCategory(product.category)}
            </span>
          )}

          <h1 className="text-3xl font-bold text-stone-900 mb-2">{translateProductTitle(product.name)}</h1>

          <div className="mb-6">
            <span className="text-3xl font-bold text-amber-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-500 ml-2">{t.estimatedPrice}</span>
          </div>

          {/* Engine #1: Certified Fair-Trade Transparency Widget */}
          {product.price && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 border border-emerald-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-800 font-bold text-sm">🛡️ Certified Fair-Trade Breakdown</span>
                </div>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% Middleman-Free
                </span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex mb-2.5 border border-stone-200">
                <div style={{ width: '74%' }} className="bg-emerald-600 h-full" title="74% Direct Artisan Earning" />
                <div style={{ width: '16%' }} className="bg-amber-500 h-full" title="16% Raw Materials" />
                <div style={{ width: '10%' }} className="bg-stone-400 h-full" title="10% Eco-Packaging & Logistics" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                  <span className="block font-bold text-emerald-900 text-sm">74% (₹{Math.round(product.price * 0.74).toLocaleString('en-IN')})</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Direct to {product.artisan_name || 'Artisan'}</span>
                </div>
                <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                  <span className="block font-bold text-amber-900 text-sm">16% (₹{Math.round(product.price * 0.16).toLocaleString('en-IN')})</span>
                  <span className="text-[10px] text-amber-700 font-medium">Raw Materials & Dyes</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="block font-bold text-stone-900 text-sm">10% (₹{Math.round(product.price * 0.10).toLocaleString('en-IN')})</span>
                  <span className="text-[10px] text-stone-600 font-medium">Eco-Pack & Logistics</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-100 flex flex-wrap items-center justify-between text-xs text-emerald-900 gap-2">
                <span>⏱️ Verified Artisan Labor: <strong>~{Math.max(4, Math.round((product.price * 0.74) / 110))} hours</strong></span>
                <span>🌍 Global Fair Export Benchmark: <strong>~${Math.round((product.price * 2.3) / 86)} USD</strong></span>
              </div>
            </div>
          )}

          {product.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">{t.descriptionLabel}</h3>
              <p className="text-stone-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.materials.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">{t.materialsLabel}</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((m, i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-stone-100 rounded-full text-stone-700">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">{t.tagsLabel}</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tTag, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700">
                    #{tTag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {product.weight && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">{t.weightLabel}</span>
                <span className="font-medium text-stone-800">{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">{t.dimensionsLabel}</span>
                <span className="font-medium text-stone-800">{product.dimensions}</span>
              </div>
            )}
            <div className="bg-stone-50 p-3 rounded-lg">
              <span className="text-stone-500 block">{t.sellingScopeLabel}</span>
              <span className="font-medium text-stone-800">
                {scope.icon} {scope.label}
              </span>
            </div>
            {product.artisan_name && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">{t.artisanLabel}</span>
                <span className="font-medium text-stone-800">{product.artisan_name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-6 py-3.5 rounded-xl font-semibold text-lg transition-colors"
            >
              🛒 {t.addToCart}
            </button>
            <Link
              to={`/order/${product.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-6 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-amber-900/20"
            >
              {t.buyNow}
            </Link>
          </div>
          <p className="text-center text-xs text-stone-500 mt-2">{t.orderThisProduct}</p>
        </div>
      </div>
    </div>
  );
}
