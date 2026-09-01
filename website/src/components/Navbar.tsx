import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-amber-700 font-semibold' : 'text-stone-600 hover:text-amber-700';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🪷</span>
            <span className="text-2xl font-bold text-amber-950 font-serif tracking-tight">
              Karigar<span className="text-amber-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-medium transition-colors ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/browse" className={`font-medium transition-colors ${isActive('/browse')}`}>
              Browse Collection
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-stone-100">
            <Link
              to="/"
              className={`block py-2 ${isActive('/')}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`block py-2 ${isActive('/browse')}`}
              onClick={() => setMenuOpen(false)}
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
