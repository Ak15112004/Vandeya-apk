import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const VandeyaLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 56, text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-4xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Engineered Modern V Emblem with Ashoka Chakra & Digital Nodes */}
      <div className="relative flex items-center justify-center" style={{ width: current.icon, height: current.icon }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_16px_rgba(255,107,8,0.35)] transition-transform duration-300 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Saffron Gradient */}
            <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#FF6B08" />
            </linearGradient>

            {/* Emerald Green Gradient */}
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Radiant White/Silver Gradient */}
            <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Ashoka Chakra Radiant Center */}
            <radialGradient id="chakraAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0055A5" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#002D62" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#001838" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background subtle chakra aura */}
          <circle cx="50" cy="42" r="34" fill="url(#chakraAura)" />

          {/* 24-spoke Ashoka Chakra subtle constellation rings */}
          <g opacity="0.45" stroke="#38BDF8" strokeWidth="0.75">
            <circle cx="50" cy="42" r="28" strokeDasharray="1.5 3" />
            <circle cx="50" cy="42" r="20" strokeDasharray="2 4" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="42"
                x2={50 + 26 * Math.cos((i * 30 * Math.PI) / 180)}
                y2={42 + 26 * Math.sin((i * 30 * Math.PI) / 180)}
                strokeOpacity="0.3"
              />
            ))}
          </g>

          {/* Digital Connection Nodes */}
          <circle cx="16" cy="24" r="3" fill="#FF9933" className="animate-pulse" />
          <circle cx="84" cy="24" r="3" fill="#10B981" className="animate-pulse" />
          <circle cx="50" cy="88" r="3.5" fill="#FFFFFF" />
          <line x1="16" y1="24" x2="28" y2="38" stroke="#FF9933" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="2 2" />
          <line x1="84" y1="24" x2="72" y2="38" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="2 2" />

          {/* The Heroic "V" Symbol - Saffron Left Wing */}
          <path
            d="M 18 24 L 38 24 L 50 68 L 42 68 Z"
            fill="url(#saffronGrad)"
            filter="drop-shadow(0 2px 4px rgba(255,107,8,0.5))"
          />

          {/* The Heroic "V" Symbol - Emerald Green Right Wing */}
          <path
            d="M 82 24 L 62 24 L 50 68 L 58 68 Z"
            fill="url(#emeraldGrad)"
            filter="drop-shadow(0 2px 4px rgba(5,150,105,0.5))"
          />

          {/* Central Ascending White Core with Apex Diamond */}
          <path
            d="M 44 24 L 56 24 L 50 50 Z"
            fill="url(#whiteGrad)"
          />
          <polygon
            points="50,72 44,84 50,88 56,84"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 6px rgba(255,255,255,0.9))"
          />

          {/* Central Ashoka Chakra Micro Navel */}
          <circle cx="50" cy="42" r="5" fill="#002D62" stroke="#38BDF8" strokeWidth="1.2" />
          <circle cx="50" cy="42" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography: English + Hindi Calligraphy */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-2">
            <span className={`font-black tracking-tight text-white ${current.text} font-sans`}>
              VANDEYA
            </span>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400 text-xs tracking-wider">
              वंदेया
            </span>
          </div>
          {showTagline && (
            <span className={`font-medium tracking-wider text-slate-400 uppercase mt-0.5 ${current.sub}`}>
              Connect India · Inspire the World
            </span>
          )}
        </div>
      )}
    </div>
  );
};
