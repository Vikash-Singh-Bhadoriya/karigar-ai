import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../api/client';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#FFFCF8] shadow-2xl z-[101] flex flex-col border-l border-amber-200"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-amber-100 flex items-center justify-between bg-white">
              <h2 className="text-2xl font-serif font-bold text-stone-800 flex items-center gap-2">
                Your Cart <span className="text-xl">🛒</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-amber-100 hover:text-amber-800 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                  <span className="text-6xl opacity-30">🪹</span>
                  <p className="text-lg">Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 bg-amber-100 text-amber-900 rounded-full font-medium hover:bg-amber-200 transition-colors"
                  >
                    Keep Browsing
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm border border-stone-100">
                    <img 
                      src={getImageUrl(item.product.image_url)} 
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover rounded-xl bg-stone-50"
                    />
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-stone-800 line-clamp-1">{item.product.name}</h3>
                      <p className="text-amber-700 font-bold text-sm mt-1">₹{item.product.price?.toLocaleString('en-IN')}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-stone-50 rounded-lg px-2 py-1 border border-stone-200">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-amber-700 font-bold">-</button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-amber-700 font-bold">+</button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-600 text-sm font-medium px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-amber-100 shadow-[0_-10px_40px_-15px_rgba(217,119,6,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-500 font-medium text-lg">Subtotal ({totalItems} items)</span>
                  <span className="text-2xl font-bold text-amber-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <Link 
                  to="/checkout"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Checkout page would open here!");
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transform transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout <span className="text-xl">✨</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
