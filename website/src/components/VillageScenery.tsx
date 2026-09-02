
export default function VillageScenery() {
  return (
    <div className="relative w-full h-64 overflow-hidden pointer-events-none mt-12 bg-transparent">
      {/* 
        PURE CSS ANIMATIONS (Hardware Accelerated) 
      */}
      <style>{`
        @keyframes walkLeftScene {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-20vw); }
        }
        @keyframes walkRightScene {
          0% { transform: translateX(-20vw) scaleX(-1); }
          100% { transform: translateX(110vw) scaleX(-1); }
        }
        @keyframes breatheScene {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(5px) scaleY(1.05); }
        }
        @keyframes swayScene {
          0%, 100% { transform: rotate(-6deg); origin: bottom center; }
          50% { transform: rotate(6deg); origin: bottom center; }
        }
        @keyframes bobScene {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .village-mural-animal {
          filter: sepia(0.2) saturate(1.4) opacity(0.5);
          position: absolute;
          bottom: 20px;
        }
        .village-mural-tree {
          filter: sepia(0.4) hue-rotate(40deg) saturate(0.8) opacity(0.35);
          position: absolute;
          bottom: 10px;
          font-size: 8rem;
        }
        .village-craftsman {
          filter: sepia(0.4) saturate(1.2) opacity(0.6);
          position: absolute;
          bottom: 15px;
        }
      `}</style>

      {/* Beautiful Animated Green Grass / Ground Curves */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-32 text-green-300/40" 
        style={{ animation: 'breatheScene 8s ease-in-out infinite' }} 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,100,44,150,56.44,208.62,71.21,263.85,67,321.39,56.44Z"></path>
      </svg>
      <svg 
        className="absolute bottom-0 left-0 w-full h-24 text-green-400/50" 
        style={{ animation: 'breatheScene 10s ease-in-out infinite reverse' }} 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
      </svg>

      {/* Scenery: Trees & Peacocks */}
      <div className="village-mural-tree" style={{ left: '15%' }}>🌳</div>
      <div className="village-mural-tree" style={{ left: '50%', bottom: '25px', fontSize: '6rem' }}>🌲</div>
      <div className="village-mural-tree" style={{ left: '80%' }}>🌳</div>
      <div className="village-mural-animal text-5xl" style={{ left: '20%', bottom: '35px', animation: 'swayScene 4s ease-in-out infinite' }}>🦚</div>
      <div className="village-mural-animal text-5xl" style={{ left: '82%', bottom: '30px', animation: 'swayScene 5s ease-in-out infinite reverse' }}>🦚</div>

      {/* Scenery: Craftsmen & Women (Working) */}
      <div className="village-craftsman text-5xl" style={{ left: '12%', animation: 'bobScene 2.2s infinite' }}>👩🏽‍🎨🥻</div>
      <div className="village-craftsman text-3xl md:text-4xl text-amber-900 font-bold" style={{ left: '16%', bottom: '60px', opacity: 0.4 }}>embroidery</div>

      <div className="village-craftsman text-5xl" style={{ left: '38%', animation: 'bobScene 2s infinite' }}>👩🏽‍🌾🧶</div>
      <div className="village-craftsman text-3xl md:text-4xl text-amber-900 font-bold" style={{ left: '42%', bottom: '60px', opacity: 0.4 }}>weaving</div>
      
      <div className="village-craftsman text-5xl" style={{ left: '62%', animation: 'bobScene 2.5s infinite reverse' }}>👨🏽‍🎨🏺</div>
      <div className="village-craftsman text-3xl md:text-4xl text-amber-900 font-bold" style={{ left: '66%', bottom: '60px', opacity: 0.4 }}>pottery</div>

      <div className="village-craftsman text-5xl" style={{ left: '85%', animation: 'bobScene 2.3s infinite reverse' }}>👨🏽‍🔧🪵</div>
      <div className="village-craftsman text-3xl md:text-4xl text-amber-900 font-bold" style={{ left: '88%', bottom: '60px', opacity: 0.4 }}>woodwork</div>

      {/* Scenery: Walking Animals */}
      <div className="village-mural-animal text-6xl" style={{ animation: 'walkLeftScene 120s linear infinite' }}>🐘</div>
      <div className="village-mural-animal text-5xl" style={{ animation: 'walkLeftScene 150s linear infinite', animationDelay: '-40s' }}>🐄</div>
      <div className="village-mural-animal text-5xl" style={{ animation: 'walkLeftScene 180s linear infinite', animationDelay: '-110s' }}>🐄</div>
      <div className="village-mural-animal text-4xl" style={{ animation: 'walkRightScene 60s linear infinite', animationDelay: '-20s', bottom: '25px' }}>🦌</div>
      <div className="village-mural-animal text-5xl" style={{ animation: 'walkRightScene 90s linear infinite', animationDelay: '-70s', bottom: '15px' }}>🦌</div>

      {/* Swaying Grass Tufts */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={`grass-${i}`} 
          className="village-mural-animal" 
          style={{ 
            left: `${Math.random() * 100}vw`,
            bottom: `${Math.random() * 10}px`,
            fontSize: '2rem',
            animation: `swayScene ${Math.random() * 2 + 3}s ease-in-out infinite ${Math.random()}s` 
          }}
        >
          🌿
        </div>
      ))}
    </div>
  );
}
