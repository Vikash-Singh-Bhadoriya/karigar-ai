import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getImageUrl } from '../api/client';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 hover:border-amber-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={getImageUrl(product.image_url)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {product.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {product.category}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-stone-900 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-700">
            {formatPrice(product.price)}
          </span>
          {product.artisan_name && (
            <span className="text-xs text-stone-500">
              by {product.artisan_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
