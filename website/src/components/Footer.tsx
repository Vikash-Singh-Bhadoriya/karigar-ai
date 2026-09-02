import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/assets/brand/logo-flat.png" 
                alt="KarigarAI logo" 
                loading="lazy" 
                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm leading-relaxed">
              कारीगर AI — भारतीय कारीगरों का डिजिटल बाज़ार
            </p>
            <p className="text-sm mt-2 leading-relaxed">
              AI-powered marketplace connecting Indian artisans directly to buyers.
              Every product is handcrafted with love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm hover:text-amber-400 transition-colors">
                Home
              </Link>
              <Link to="/browse" className="block text-sm hover:text-amber-400 transition-colors">
                Browse Products
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <p className="text-sm leading-relaxed">
              Built for Smart India Hackathon (SIH).
            </p>
            <p className="text-sm mt-2 text-stone-400">
              Powered by Google Gemini AI ✨
            </p>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} KarigarAI — Made with ❤️ for Indian Artisans
        </div>
      </div>
    </footer>
  );
}
