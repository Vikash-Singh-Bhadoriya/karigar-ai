import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-amber-50/40">
      {/* Layer 1: Ambient shifting gradients */}
      <motion.div 
        animate={{ 
          background: [
            'radial-gradient(circle at 0% 0%, rgba(217, 119, 6, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 100% 100%, rgba(217, 119, 6, 0.12) 0%, transparent 60%)',
            'radial-gradient(circle at 0% 0%, rgba(217, 119, 6, 0.08) 0%, transparent 60%)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Layer 2: Slow panning rich textile pattern watermark */}
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{ 
          backgroundImage: "url('/images/textile_hero.jpg')",
          backgroundSize: '400px'
        }}
      />

      {/* Layer 3: Giant Rotating Mandalas */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20vh] -left-[10vw] text-amber-700/5 select-none"
        style={{ fontSize: '80vh', lineHeight: 1 }}
      >
        ❁
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20vh] -right-[10vw] text-amber-700/5 select-none"
        style={{ fontSize: '90vh', lineHeight: 1 }}
      >
        ✺
      </motion.div>

      {/* Layer 4: Floating golden sparks (Diyas/Magic) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-500/40 blur-[1px]"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + 'vw',
            top: Math.random() * 100 + 'vh',
          }}
          animate={{
            y: [0, -300],
            x: [0, (Math.random() - 0.5) * 150],
            opacity: [0, Math.random() * 0.5 + 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
