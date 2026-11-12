import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export const VandeyaAppIcon: React.FC<AppIconProps> = ({
  size = 72,
  className = '',
  withGlow = true,
}) => {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-[22.5%] bg-gradient-to-tr from-[#FF6B08]/40 via-[#0055A5]/30 to-[#059669]/40 blur-lg -z-10 transform scale-110"
        />
      )}

      {/* Android Squircle Icon Container */}
      <div
        className="w-full h-full rounded-[22.5%] p-[2px] bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-950 shadow-2xl relative overflow-hidden"
      >
        {/* Inner Canvas with Deep India Navy Background */}
        <div className="w-full h-full rounded-[21%] bg-[#030B1E] relative overflow-hidden flex items-center justify-center">
          {/* Subtle Radiant Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF6B08]/20 via-transparent to-[#059669]/20" />
          
          {/* Ashoka Chakra 24-spoke Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] text-sky-400 animate-[spin_60s_linear_infinite]" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="38" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
              <circle cx="50" cy="50" r="28" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="6" strokeWidth="1" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 37 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 37 * Math.sin((i * 15 * Math.PI) / 180)}
                  strokeWidth="0.6"
                />
              ))}
            </svg>
          </div>

          {/* Central Illuminated V Emblem */}
          <svg
            viewBox="0 0 100 100"
            className="w-[72%] h-[72%] relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            fill="none"
          >
            {/* Saffron Left Wing */}
            <path
              d="M 18 24 L 38 24 L 50 68 L 42 68 Z"
              fill="url(#iconSaffron)"
            />
            {/* Emerald Right Wing */}
            <path
              d="M 82 24 L 62 24 L 50 68 L 58 68 Z"
              fill="url(#iconEmerald)"
            />
            {/* White Core Beam */}
            <path
              d="M 44 24 L 56 24 L 50 50 Z"
              fill="#FFFFFF"
            />
            <polygon
              points="50,72 44,84 50,88 56,84"
              fill="#FFFFFF"
            />
            {/* Center Ashoka Jewel */}
            <circle cx="50" cy="42" r="4.5" fill="#002D62" stroke="#38BDF8" strokeWidth="1.2" />
            <circle cx="50" cy="42" r="1.5" fill="#FFFFFF" />

            <defs>
              <linearGradient id="iconSaffron" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFA439" />
                <stop offset="100%" stopColor="#FF6B08" />
              </linearGradient>
              <linearGradient id="iconEmerald" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
          </svg>

          {/* Top Edge Specular Reflection (Glassmorphism highlight) */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[21%]" />
        </div>
      </div>
    </div>
  );
};
