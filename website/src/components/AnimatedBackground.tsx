import { useEffect, useState } from 'react';

// Intricate SVG Mandala Path
const MANDALA_PATH = "M12 2C12 2 10 7 6 7C2 7 2 12 2 12C2 12 7 14 7 18C7 22 12 22 12 22C12 22 14 17 18 17C22 17 22 12 22 12C22 12 17 10 17 6C17 2 12 2 12 2ZM12 4.5C13.5 6.5 15.5 8 17.5 8.5C15.5 10.5 14.5 12.5 14.5 14.5C12.5 13.5 10 13.5 8 14.5C8 12.5 7 10.5 5 8.5C7 8 9.5 6.5 12 4.5Z";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate static values to feed pure CSS animations (Zero Lag)
    setPetals(Array.from({ length: 60 }).map((_, i) => {
      // Light pastel colors: Rose, Soft Gold, Peach, Mint
      const colors = ['#FBCFE8', '#FDE68A', '#FFDAB9', '#A7F3D0'];
      return {
        left: Math.random() * 100,
        delay: Math.random() * 20, // Stagger them out more
        duration: Math.random() * 15 + 10,
        color: colors[i % 4],
        scale: Math.random() * 0.7 + 0.5
      };
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#FCFBF8]">
      {/* 
        PURE CSS ANIMATIONS (Hardware Accelerated) 
        This completely eliminates the Framer Motion / SVG filter lag.
      */}
      <style>{`
        @keyframes fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(0, 110vh, 0) rotate(720deg); opacity: 0; }
        }
        @keyframes walkLeft {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-20vw); }
        }
        @keyframes walkRight {
          0% { transform: translateX(-20vw) scaleX(-1); }
          100% { transform: translateX(110vw) scaleX(-1); }
        }
        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(5px) scaleY(1.05); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-8deg) origin-bottom; }
          50% { transform: rotate(8deg) origin-bottom; }
        }
        .mural-animal {
          filter: sepia(0.2) saturate(1.4) opacity(0.35);
          position: absolute;
          bottom: 10vh;
        }
        .mural-tree {
          filter: sepia(0.4) hue-rotate(40deg) saturate(0.8) opacity(0.25);
          position: absolute;
          bottom: 8vh;
          font-size: 8rem;
        }
        .grass-tuft {
          position: absolute;
          bottom: 2vh;
          font-size: 2rem;
          filter: sepia(0.2) hue-rotate(60deg) opacity(0.4);
          transform-origin: bottom center;
        }
        .petal {
          position: absolute;
          border-radius: 50% 0 50% 50%;
          box-shadow: inset 2px 2px 4px rgba(255,255,255,0.4);
        }
      `}</style>

      {/* Light Pastel Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-amber-50/30 to-teal-50/20"></div>

      {/* Intricate Rotating Mandalas (Very Faint) */}
      <div className="absolute -top-[30vh] -left-[20vw] opacity-[0.03] text-rose-900" style={{ animation: 'spinSlow 200s linear infinite' }}>
        <svg width="80vh" height="80vh" viewBox="0 0 24 24" fill="currentColor">
          <path d={MANDALA_PATH} transform="scale(0.8) translate(3,3)" />
          <path d={MANDALA_PATH} transform="rotate(45 12 12) scale(0.8) translate(3,3)" />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.2" fill="none" />
        </svg>
      </div>

      <div className="absolute -bottom-[40vh] -right-[20vw] opacity-[0.03] text-teal-900" style={{ animation: 'spinSlow 250s linear infinite reverse' }}>
        <svg width="100vh" height="100vh" viewBox="0 0 24 24" fill="currentColor">
          <path d={MANDALA_PATH} transform="scale(0.9) translate(1,1)" />
          <path d={MANDALA_PATH} transform="rotate(30 12 12) scale(0.9) translate(1,1)" />
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.1" fill="none" />
        </svg>
      </div>

      {/* Falling Flowers / Petals */}
      {petals.map((petal, i) => (
        <div
          key={`petal-${i}`}
          className="petal"
          style={{
            width: `${12 * petal.scale}px`,
            height: `${12 * petal.scale}px`,
            background: petal.color,
            left: `${petal.left}vw`,
            animation: `fall ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
