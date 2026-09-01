import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { getProducts } from '../api/client';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Saree', emoji: '🧣' },
  { name: 'Pottery', emoji: '🏺' },
  { name: 'Bag', emoji: '👜' },
  { name: 'Jewellery', emoji: '💎' },
  { name: 'Home Decor', emoji: '🏠' },
  { name: 'Clothing', emoji: '👘' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then((res) => setProducts(res.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Royal Hero Section */}
      <section 
        className="relative bg-cover bg-center py-40 px-4"
        style={{ backgroundImage: "url('/images/textile_hero.jpg')" }}
      >
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/90"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto text-center z-10"
        >
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4 block">
            भारत की विरासत — India's Heritage
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl font-serif leading-tight">
            The Royal <span className="text-amber-400">Artisan</span> Legacy
          </h1>
          <p className="text-2xl md:text-3xl text-amber-100 mb-6 font-serif italic">
            सीधे कारीगरों के हाथों से
          </p>
          <p className="text-stone-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed drop-shadow-md">
            Step into the majestic world of Indian craftsmanship. We connect you directly with skilled artisans across the country, ensuring every piece you buy is authentic, handmade, and carries a rich cultural story.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(217,119,6,0.4)] hover:shadow-[0_0_60px_rgba(217,119,6,0.6)]"
            >
              Explore the Collection →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* The Art of Karigar (Image Gallery) */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-stone-900 font-serif mb-4 drop-shadow-sm">हमारी कला — The Craftsmanship</h2>
          <div className="h-1 w-24 bg-amber-600 mx-auto rounded-full mb-6 shadow-md"></div>
          <p className="text-stone-700 max-w-2xl mx-auto text-lg font-medium drop-shadow-sm">
            Witness the intricate processes passed down through generations. From delicate brush strokes to rhythmic weaving, our artisans pour their soul into every creation.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { src: '/images/carpet.jpg', title: 'Textile Weaving', desc: 'Traditional Loom Art' },
            { src: '/images/painting.jpg', title: 'Kalamkari', desc: 'Natural Dye Painting', offset: true },
            { src: '/images/bamboo.jpg', title: 'Bamboo Craft', desc: 'Sustainable Art' },
            { src: '/images/stall.jpg', title: 'Local Bazaars', desc: 'Direct to You', offset: true }
          ].map((item, i) => (
            <motion.div 
              key={i} variants={fadeUp}
              className={`group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] border border-white/20 ${item.offset ? 'lg:translate-y-8' : ''}`}
            >
              <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-white text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-amber-200 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="bg-white/50 backdrop-blur-md py-24 px-4 border-t border-b border-amber-200/40 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-stone-900 font-serif mb-4 drop-shadow-sm">नवीनतम प्रोडक्ट्स</h2>
              <div className="h-1.5 w-20 bg-amber-600 rounded-full mb-4 shadow-md"></div>
              <p className="text-stone-700 text-lg font-serif italic drop-shadow-sm">Freshly crafted items straight from the artisans.</p>
            </div>
            {products.length > 0 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/browse" className="text-amber-800 font-semibold mt-6 md:mt-0 flex items-center gap-2 group bg-amber-100/80 hover:bg-amber-200 shadow-md px-6 py-3 rounded-full transition-colors backdrop-blur-sm">
                  View All Collection 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin shadow-lg" />
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative overflow-hidden text-center py-24 px-6 bg-gradient-to-br from-amber-50/90 to-orange-50/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-amber-400/70 shadow-xl group"
            >
              <div className="absolute top-4 left-4 text-amber-300 text-4xl animate-pulse">❀</div>
              <div className="absolute top-4 right-4 text-amber-300 text-4xl animate-pulse delay-75">❀</div>
              <div className="absolute bottom-4 left-4 text-amber-300 text-4xl animate-pulse delay-150">❀</div>
              <div className="absolute bottom-4 right-4 text-amber-300 text-4xl animate-pulse delay-300">❀</div>

              <div className="flex justify-center gap-4 mb-6 text-5xl drop-shadow-lg">
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}>🏺</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}>🧣</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}>🖼️</motion.span>
              </div>
              
              <h3 className="text-3xl font-serif text-amber-950 mb-3 drop-shadow-sm">
                कारीगर अपने उत्पाद तैयार कर रहे हैं
              </h3>
              <p className="text-amber-800 text-xl font-medium mb-4 drop-shadow-sm">
                The marketplace is warming up!
              </p>
              <p className="text-stone-700 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
                Our artisans are currently photographing and preparing their beautiful handcrafted catalogs. If you have the KarigarAI app, scan a product to see it appear here instantly!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {products.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-stone-900 font-serif mb-4 drop-shadow-sm">Explore Categories</h2>
          <div className="h-1 w-24 bg-amber-600 mx-auto rounded-full shadow-md"></div>
        </motion.div>
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.name} variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-200/40 hover:bg-white/90 transition-all group h-full shadow-lg"
              >
                <span className="text-4xl mb-4 transform transition-transform duration-300 drop-shadow-md">
                  {cat.emoji}
                </span>
                <span className="text-sm font-bold text-stone-800 drop-shadow-sm">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
