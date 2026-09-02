import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const IndianFlag = ({ className = "w-6 h-4" }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ perspective: '100px' }}>
    <style>{`
      @keyframes waveFlag {
        0%, 100% { transform: rotateY(-15deg) rotateZ(2deg) skewY(-2deg); }
        50% { transform: rotateY(15deg) rotateZ(-2deg) skewY(2deg); }
      }
      .animate-wave-flag {
        animation: waveFlag 3s ease-in-out infinite;
        transform-origin: left center;
        transform-style: preserve-3d;
      }
    `}</style>
    <svg className="w-full h-full animate-wave-flag drop-shadow-md rounded-[1px] overflow-hidden" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="20" fill="#FF9933"/>
      <rect y="20" width="90" height="20" fill="#FFFFFF"/>
      <rect y="40" width="90" height="20" fill="#138808"/>
      <g transform="translate(45,30)">
        <circle r="8.5" fill="none" stroke="#000080" strokeWidth="1.5"/>
        <circle r="1.5" fill="#000080"/>
        {Array.from({length: 24}).map((_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="8.5" stroke="#000080" strokeWidth="0.5" transform={`rotate(${i * 15})`} />
        ))}
      </g>
    </svg>
  </div>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showViksitModal, setShowViksitModal] = useState(false);
  const location = useLocation();
  const { cart, setIsCartOpen } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-amber-800 font-bold relative after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-amber-600'
      : 'text-stone-700 hover:text-amber-700 font-medium transition-colors relative after:content-[""] after:absolute after:-bottom-1.5 after:left-1/2 after:w-0 after:h-[2px] after:bg-amber-500 hover:after:w-full hover:after:left-0 after:transition-all after:duration-300';

  return (
    <div className="sticky top-0 z-50 flex flex-col shadow-md group/nav">
      {/* Top Banner - Viksit Bharat & Artisans Theme */}
      <div className="bg-gradient-to-r from-orange-800 via-amber-700 to-orange-800 text-amber-50 py-1.5 px-4 relative overflow-hidden">
        {/* Subtle background pattern (CSS radial gradients representing block prints/mandalas) */}
        <div className="absolute inset-0 opacity-10 animate-[pulse_4s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm font-medium tracking-wide relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-orange-300 animate-pulse">🪔</span>
            <span>Empowering Rural Artisans</span>
            <span className="hidden sm:inline text-amber-500/50">|</span>
            <span className="hidden sm:inline">Preserving India's Heritage</span>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 font-semibold text-amber-200">
            <span>A Step Towards</span>
            <button 
              onClick={() => setShowViksitModal(true)}
              className="bg-white/20 px-2 py-0.5 rounded-sm shadow-sm backdrop-blur-sm border border-white/10 flex items-center gap-1 hover:bg-white/30 transition-colors cursor-pointer active:scale-95"
            >
              Viksit Bharat <IndianFlag className="w-5 h-[14px] ml-1 inline-block" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#FFFCF8]/95 backdrop-blur-md border-b-2 border-amber-200/60 relative transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow-inner border border-amber-200 group-hover:scale-110 group-hover:rotate-[15deg] group-hover:shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all duration-500 relative">
                <span className="text-2xl absolute group-hover:animate-[spin_4s_linear_infinite]">🪷</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-amber-950 font-serif tracking-tight leading-none group-hover:text-orange-800 transition-colors">
                  Karigar<span className="text-orange-600">AI</span>
                </span>
                <span className="text-[0.65rem] sm:text-xs text-stone-500 font-medium tracking-widest uppercase mt-0.5 group-hover:text-amber-700 transition-colors">
                  Handcrafted with Pride
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              <Link to="/" className={isActive('/')}>
                Home
              </Link>
              <Link to="/browse" className={isActive('/browse')}>
                Browse Collection
              </Link>

              <div className="flex items-center gap-4 border-l border-amber-200 pl-4 ml-2">
                {/* Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-stone-600 hover:text-amber-800 transition-colors group"
                >
                  <span className="text-2xl transform group-hover:scale-110 transition-transform block">🛒</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>

                <Link to="/browse" className="relative px-6 py-2.5 bg-gradient-to-r from-amber-700 to-orange-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-amber-900/20 hover:shadow-amber-900/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group/btn">
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </span>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 h-full w-[200%] translate-x-[-100%] group-hover/btn:translate-x-[50%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-amber-100 bg-[#FFFCF8] absolute left-0 right-0 shadow-xl px-4">
              <Link
                to="/"
                className="block py-3 text-center font-medium text-amber-900 hover:bg-amber-50 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="block py-3 text-center font-medium text-amber-900 hover:bg-amber-50 rounded-lg mt-1"
                onClick={() => setMenuOpen(false)}
              >
                Browse Products
              </Link>
              <Link
                to="/browse"
                className="block py-3 text-center font-bold text-white bg-gradient-to-r from-amber-700 to-orange-700 rounded-lg mt-3 shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Viksit Bharat Modal */}
      <AnimatePresence>
        {showViksitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowViksitModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden bg-[#FFFCF8] border border-amber-200 rounded-3xl shadow-2xl"
            >
              {/* Modal Header Banner */}
              <div className="bg-gradient-to-r from-orange-800 via-amber-700 to-green-800 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 animate-[pulse_4s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif relative z-10 flex items-center gap-3">
                  Viksit Bharat 2047
                  <IndianFlag className="w-10 h-7 inline-block ml-1" />
                </h3>
                <p className="text-amber-100 font-medium text-sm mt-1 relative z-10">
                  Empowering Rural India, Preserving Our Heritage
                </p>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowViksitModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20"
              >
                ✕
              </button>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 relative">
                {/* Giant Faint Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.03] text-stone-900 pointer-events-none rotate-12">🪷</div>
                
                <p className="text-stone-700 leading-relaxed mb-4 text-base sm:text-lg">
                  <strong className="text-amber-900 font-serif text-xl">Viksit Bharat 2047</strong> is the Government of India's ambitious vision to transform India into a fully developed nation by its 100th year of independence.
                </p>
                <p className="text-stone-700 leading-relaxed mb-6 text-base sm:text-lg">
                  A core pillar of this mission is <strong>inclusive economic growth</strong>—ensuring that the prosperity of the nation reaches its grassroots. 
                  KarigarAI proudly supports this vision by connecting traditional rural artisans directly to the global market, ensuring fair trade, digital inclusion, and the flourishing of authentic Indian crafts.
                </p>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200/50">
                  <div className="text-3xl">🪔</div>
                  <p className="text-amber-900 text-sm font-medium">
                    "When our artisans thrive, India's heritage thrives. Together towards a Developed India."
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
