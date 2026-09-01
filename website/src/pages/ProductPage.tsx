import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types';
import { getProduct, getImageUrl } from '../api/client';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

const SCOPE_LABELS: Record<string, { label: string; icon: string }> = {
  local: { label: 'Local Delivery', icon: '📍' },
  states: { label: 'State Level', icon: '🏛️' },
  india: { label: 'All India', icon: '🇮🇳' },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-stone-500 mb-6">यह प्रोडक्ट उपलब्ध नहीं है।</p>
        <Link to="/browse" className="text-amber-700 font-semibold hover:underline">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const scope = SCOPE_LABELS[product.selling_scope] || SCOPE_LABELS.local;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/browse" className="text-amber-700 hover:underline text-sm mb-6 inline-block">
        ← Back to Products
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
              {product.category}
            </span>
          )}

          <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>

          <div className="mb-6">
            <span className="text-3xl font-bold text-amber-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-500 ml-2">अनुमानित मूल्य</span>
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">Description</h3>
              <p className="text-stone-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.materials.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">Materials</h3>
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
              <h3 className="text-sm font-semibold text-stone-500 uppercase mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {product.weight && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">Weight</span>
                <span className="font-medium text-stone-800">{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">Dimensions</span>
                <span className="font-medium text-stone-800">{product.dimensions}</span>
              </div>
            )}
            <div className="bg-stone-50 p-3 rounded-lg">
              <span className="text-stone-500 block">Selling Scope</span>
              <span className="font-medium text-stone-800">
                {scope.icon} {scope.label}
              </span>
            </div>
            {product.artisan_name && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <span className="text-stone-500 block">Artisan</span>
                <span className="font-medium text-stone-800">{product.artisan_name}</span>
              </div>
            )}
          </div>

          <Link
            to={`/order/${product.id}`}
            className="inline-flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-amber-200"
          >
            🛒 इस प्रोडक्ट को ऑर्डर करें
          </Link>
          <p className="text-center text-xs text-stone-500 mt-2">Order This Product</p>
        </div>
      </div>
    </div>
  );
}
