import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { getProducts } from '../api/client';
import ProductCard from '../components/ProductCard';
import VillageScenery from '../components/VillageScenery';



const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
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
          className="text-center mb-16 relative"
        >
          {/* Decorative Branches (Left & Right) */}
          <div className="absolute left-[5%] md:left-[15%] -top-12 md:-top-8 text-7xl md:text-8xl opacity-30 filter sepia-[0.3] saturate-[1.2] rotate-[-20deg] pointer-events-none origin-bottom animate-[swayScene_6s_ease-in-out_infinite]">🌿</div>
          <div className="absolute right-[5%] md:right-[15%] -top-12 md:-top-8 text-7xl md:text-8xl opacity-30 filter sepia-[0.3] saturate-[1.2] rotate-[20deg] scale-x-[-1] pointer-events-none origin-bottom animate-[swayScene_5s_ease-in-out_infinite_reverse]">🌿</div>

          {/* Floating Petals near header */}
          <div className="absolute left-[25%] -top-4 text-3xl opacity-50 text-rose-300 animate-[bounce_4s_infinite]">🌸</div>
          <div className="absolute right-[25%] top-2 text-2xl opacity-40 text-rose-300 animate-[bounce_3s_infinite_reverse]">🌸</div>

          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-serif mb-4 drop-shadow-sm flex items-center justify-center gap-3">
            <span className="text-rose-400 opacity-80 text-2xl animate-pulse">🌺</span>
            हमारी कला — The Craftsmanship
            <span className="text-rose-400 opacity-80 text-2xl animate-pulse">🌺</span>
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-12 md:w-20 bg-amber-600 rounded-full shadow-md"></div>
            <span className="text-amber-500 text-2xl animate-[spinSlow_20s_linear_infinite]">❁</span>
            <div className="h-1 w-12 md:w-20 bg-amber-600 rounded-full shadow-md"></div>
          </div>
          
          <p className="text-stone-700 max-w-2xl mx-auto text-lg font-medium drop-shadow-sm relative z-10 px-4">
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

      {/* Our Promise & Trust Badges */}
      <section className="py-28 px-4 bg-[#FFFCF8] relative z-10 overflow-hidden">
        {/* Decorative corner mandalas (faint) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-950 font-serif mb-6 drop-shadow-sm">
              Our Promise to India
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-amber-300"></div>
              <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
              <div className="h-px w-12 bg-amber-300"></div>
            </div>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              More than just a marketplace, KarigarAI is a movement to digitize rural craftsmanship and build a truly self-reliant India.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* Trust Badge 1 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-10 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-amber-100 shadow-[0_8px_30px_rgb(217,119,6,0.06)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(217,119,6,0.12)] hover:bg-white transition-all duration-500 relative overflow-hidden">
              {/* Giant Faint Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.02] text-amber-900 pointer-events-none group-hover:rotate-12 transition-transform duration-700">🪷</div>
              
              <div className="absolute inset-0 border-2 border-dashed border-amber-200/40 rounded-[2rem] m-2 pointer-events-none">
                <div className="absolute -top-2.5 -left-2.5 text-amber-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -top-2.5 -right-2.5 text-amber-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -left-2.5 text-amber-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -right-2.5 text-amber-200/60 text-lg rotate-45">✥</div>
              </div>
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-amber-100 rounded-full animate-[spin_10s_linear_infinite] opacity-50 border border-dashed border-amber-400"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full shadow-inner border border-amber-200/50"></div>
                {/* Custom SVG for Growth/Viksit */}
                <svg className="w-10 h-10 text-amber-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-amber-950 font-serif mb-2 relative z-10">Viksit Bharat Vision</h3>
              <div className="flex gap-1 justify-center mb-4 opacity-40">
                <span className="w-1 h-1 rounded-full bg-amber-800"></span>
                <span className="w-1 h-1 rounded-full bg-amber-800"></span>
                <span className="w-1 h-1 rounded-full bg-amber-800"></span>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium relative z-10">
                Empowering rural economies by bridging the digital divide. We enable artisans to go online using just their native voice and a smartphone camera.
              </p>
            </motion.div>

            {/* Trust Badge 2 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-10 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-amber-100 shadow-[0_8px_30px_rgb(217,119,6,0.06)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(217,119,6,0.12)] hover:bg-white transition-all duration-500 relative overflow-hidden">
              {/* Giant Faint Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.02] text-orange-900 pointer-events-none group-hover:rotate-12 transition-transform duration-700">❁</div>

              <div className="absolute inset-0 border-2 border-dashed border-orange-200/40 rounded-[2rem] m-2 pointer-events-none">
                <div className="absolute -top-2.5 -left-2.5 text-orange-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -top-2.5 -right-2.5 text-orange-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -left-2.5 text-orange-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -right-2.5 text-orange-200/60 text-lg rotate-45">✥</div>
              </div>
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-[spin_10s_linear_infinite_reverse] opacity-50 border border-dashed border-orange-400"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full shadow-inner border border-orange-200/50"></div>
                {/* Custom SVG for Direct to Artisan (Hands) */}
                <svg className="w-10 h-10 text-orange-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-amber-950 font-serif mb-2 relative z-10">Direct to Artisan</h3>
              <div className="flex gap-1 justify-center mb-4 opacity-40">
                <span className="w-1 h-1 rounded-full bg-orange-800"></span>
                <span className="w-1 h-1 rounded-full bg-orange-800"></span>
                <span className="w-1 h-1 rounded-full bg-orange-800"></span>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium relative z-10">
                No middlemen, no hidden fees. When you purchase on KarigarAI, you are directly supporting the livelihoods of traditional weavers and craftsmen.
              </p>
            </motion.div>

            {/* Trust Badge 3 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-10 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-amber-100 shadow-[0_8px_30px_rgb(217,119,6,0.06)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(217,119,6,0.12)] hover:bg-white transition-all duration-500 relative overflow-hidden">
              {/* Giant Faint Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.02] text-stone-900 pointer-events-none group-hover:-rotate-12 transition-transform duration-700">✺</div>

              <div className="absolute inset-0 border-2 border-dashed border-stone-200/40 rounded-[2rem] m-2 pointer-events-none">
                <div className="absolute -top-2.5 -left-2.5 text-stone-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -top-2.5 -right-2.5 text-stone-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -left-2.5 text-stone-200/60 text-lg rotate-45">✥</div>
                <div className="absolute -bottom-2.5 -right-2.5 text-stone-200/60 text-lg rotate-45">✥</div>
              </div>
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-stone-100 rounded-full animate-[spin_10s_linear_infinite] opacity-50 border border-dashed border-stone-400"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-stone-50 to-amber-50 rounded-full shadow-inner border border-stone-200/50"></div>
                {/* Custom SVG for Authentic/Sparkle */}
                <svg className="w-10 h-10 text-stone-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-amber-950 font-serif mb-2 relative z-10">Authentic Crafts</h3>
              <div className="flex gap-1 justify-center mb-4 opacity-40">
                <span className="w-1 h-1 rounded-full bg-stone-800"></span>
                <span className="w-1 h-1 rounded-full bg-stone-800"></span>
                <span className="w-1 h-1 rounded-full bg-stone-800"></span>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium relative z-10">
                Every product tells a story. We guarantee the authenticity of our catalog, ensuring you receive genuine heritage crafts directly from the source.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Traditional Village Scenery Section (Bottom) */}
      <VillageScenery />
    </div>
  );
}

