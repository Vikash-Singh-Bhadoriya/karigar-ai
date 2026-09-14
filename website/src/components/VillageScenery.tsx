
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
        }
        .village-craftsman {
          filter: sepia(0.4) saturate(1.2) opacity(0.6);
          position: absolute;
          bottom: 15px;
        }
        @media (max-width: 768px) {
          .village-mural-tree { font-size: 4rem !important; }
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

      {/* Hoisted Indian Flag */}
      <div className="absolute bottom-[10px] left-[2%] md:left-[5%] flex flex-col items-center" style={{ zIndex: 10 }}>
        <style>{`
          @keyframes waveClothStrip {
            0%, 100% { 
              transform: translateY(calc(var(--wave-factor) * 0px)) skewY(calc(var(--wave-factor) * 5deg)); 
              filter: brightness(calc(1 - (var(--wave-factor) * 0.1)));
            }
            25% {
              transform: translateY(calc(var(--wave-factor) * -3px)) skewY(0deg);
              filter: brightness(1);
            }
            50% {
              transform: translateY(calc(var(--wave-factor) * 0px)) skewY(calc(var(--wave-factor) * -5deg));
              filter: brightness(calc(1 + (var(--wave-factor) * 0.15)));
            }
            75% {
              transform: translateY(calc(var(--wave-factor) * 3px)) skewY(0deg);
              filter: brightness(1);
            }
          }
        `}</style>
        
        {/* Pole */}
        <div className="w-1.5 md:w-2 h-32 md:h-48 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 shadow-md relative flex justify-center">
          {/* Top Knob */}
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded-full shadow-sm border border-yellow-600 absolute -top-1.5 md:-top-2 z-20"></div>
          
          {/* Cloth-like Segmented Flag (6 vertical strips for realistic 3D waving) */}
          <div className="absolute top-1 md:top-2 left-full flex" style={{ zIndex: 15, marginLeft: '-1px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-[9px] h-[36px] md:w-[16px] md:h-[64px] relative overflow-hidden origin-left ${i === 5 ? 'rounded-r-sm md:rounded-r-md' : ''}`}
                style={{
                  '--wave-factor': i === 0 ? 0 : (i / 5),
                  animation: 'waveClothStrip 1.2s ease-in-out infinite',
                  animationDelay: `-${i * 0.2}s`
                } as React.CSSProperties}
              >
                {/* The continuous SVG flag stretched and shifted */}
                <div 
                  className="absolute top-0 h-full w-[54px] md:w-[96px]" 
                  style={{ left: `-${i * 100}%` }}
                >
                  <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 90 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Flag colors with slight dynamic curves on top and bottom to simulate hanging fabric */}
                    <path d="M0,0 Q45,3 90,0 V20 H0 Z" fill="#FF9933"/>
                    <path d="M0,20 H90 V40 H0 Z" fill="#FFFFFF"/>
                    <path d="M0,40 H90 V60 Q45,57 0,60 Z" fill="#138808"/>
                    <g transform="translate(45,30)">
                      <circle r="8.5" fill="none" stroke="#000080" strokeWidth="1.5"/>
                      <circle r="1.5" fill="#000080"/>
                      {Array.from({length: 24}).map((_, j) => (
                        <line key={j} x1="0" y1="0" x2="0" y2="8.5" stroke="#000080" strokeWidth="0.5" transform={`rotate(${j * 15})`} />
                      ))}
                    </g>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Base */}
        <div className="w-10 md:w-14 h-2 md:h-3 bg-gradient-to-b from-stone-400 to-stone-600 rounded-t-sm shadow-md border-t border-stone-300"></div>
        <div className="w-14 md:w-20 h-2 md:h-3 bg-gradient-to-b from-stone-500 to-stone-700 rounded-t-sm shadow-xl border-t border-stone-400"></div>
      </div>

      {/* Scenery: Trees & Peacocks */}
      <div className="village-mural-tree text-[4rem] md:text-[8rem]" style={{ left: '15%' }}>🌳</div>
      <div className="village-mural-tree text-[3rem] md:text-[6rem]" style={{ left: '50%', bottom: '25px' }}>🌲</div>
      <div className="village-mural-tree text-[4rem] md:text-[8rem]" style={{ left: '80%' }}>🌳</div>
      <div className="village-mural-animal text-2xl md:text-5xl" style={{ left: '20%', bottom: '35px', animation: 'swayScene 4s ease-in-out infinite' }}>🦚</div>
      <div className="village-mural-animal text-2xl md:text-5xl" style={{ left: '82%', bottom: '30px', animation: 'swayScene 5s ease-in-out infinite reverse' }}>🦚</div>

      {/* Scenery: Craftsmen & Women (Working) */}
      <div className="village-craftsman flex flex-col items-center" style={{ left: '10%', animation: 'bobScene 2.2s infinite' }}>
        <div className="text-3xl md:text-5xl">👩🏽‍🎨🥻</div>
        <div className="text-[10px] md:text-3xl text-amber-900 font-bold opacity-40 mt-1 md:mt-2">embroidery</div>
      </div>
      
      <div className="village-craftsman flex flex-col items-center" style={{ left: '35%', animation: 'bobScene 2s infinite' }}>
        <div className="text-3xl md:text-5xl">👩🏽‍🌾🧶</div>
        <div className="text-[10px] md:text-3xl text-amber-900 font-bold opacity-40 mt-1 md:mt-2">weaving</div>
      </div>
      
      <div className="village-craftsman flex flex-col items-center" style={{ left: '60%', animation: 'bobScene 2.5s infinite reverse' }}>
        <div className="text-3xl md:text-5xl">👨🏽‍🎨🏺</div>
        <div className="text-[10px] md:text-3xl text-amber-900 font-bold opacity-40 mt-1 md:mt-2">pottery</div>
      </div>

      <div className="village-craftsman flex flex-col items-center" style={{ left: '82%', animation: 'bobScene 2.3s infinite reverse' }}>
        <div className="text-3xl md:text-5xl">👨🏽‍🔧🪵</div>
        <div className="text-[10px] md:text-3xl text-amber-900 font-bold opacity-40 mt-1 md:mt-2">woodwork</div>
      </div>

      {/* Scenery: Walking Animals */}
      <div className="village-mural-animal text-3xl md:text-6xl" style={{ animation: 'walkLeftScene 120s linear infinite' }}>🐘</div>
      <div className="village-mural-animal text-2xl md:text-5xl" style={{ animation: 'walkLeftScene 150s linear infinite', animationDelay: '-40s' }}>🐄</div>
      <div className="village-mural-animal text-2xl md:text-5xl" style={{ animation: 'walkLeftScene 180s linear infinite', animationDelay: '-110s' }}>🐄</div>
      <div className="village-mural-animal text-xl md:text-4xl" style={{ animation: 'walkRightScene 60s linear infinite', animationDelay: '-20s', bottom: '25px' }}>🦌</div>
      <div className="village-mural-animal text-2xl md:text-5xl" style={{ animation: 'walkRightScene 90s linear infinite', animationDelay: '-70s', bottom: '15px' }}>🦌</div>

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
