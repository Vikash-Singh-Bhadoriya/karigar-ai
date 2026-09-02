import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getImageUrl } from '../api/client';
import { useCart } from '../contexts/CartContext';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col bg-[#FFFCF8] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-300 relative h-full">
      {/* Handcrafted Badge */}
      <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-amber-100 flex items-center gap-1.5 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800">Authentic</span>
        <span className="text-xs">✨</span>
      </div>

      <Link to={`/product/${product.id}`} className="aspect-[4/3] overflow-hidden bg-stone-100 relative block z-10">
        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors z-10"></div>
        <img
          src={getImageUrl(product.image_url)}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow relative z-10">
        {/* Subtle background motif */}
        <div className="absolute right-0 bottom-0 opacity-[0.03] text-6xl pointer-events-none transform translate-x-4 translate-y-4">
          🪷
        </div>
        
        <div className="flex items-center gap-2 mb-3 relative z-10">
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100/80 text-amber-900 border border-amber-200/50">
              {product.category}
            </span>
          )}
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg font-bold text-stone-800 line-clamp-2 mb-4 group-hover:text-amber-700 transition-colors relative z-10">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex flex-col gap-4 relative z-10">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">Price</span>
              <span className="text-xl font-bold text-amber-800 drop-shadow-sm">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.artisan_name && (
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">Artisan</span>
                <span className="text-sm text-stone-600 font-medium italic">
                  {product.artisan_name}
                </span>
              </div>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={() => addToCart(product)}
            className="w-full py-2.5 bg-amber-100/50 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-200 hover:border-amber-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-lg">🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
