import React, { useState, useEffect } from 'react';
import { VandeyaLogo } from './VandeyaLogo';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);   // Logo assembly
    const t2 = setTimeout(() => setStage(2), 1400);  // Tagline & glow
    const t3 = setTimeout(() => setStage(3), 2200);  // Ready state
    const t4 = setTimeout(() => {
      onComplete();
    }, 3200); // Auto enter

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030B1E] text-white overflow-hidden select-none">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A1A3D] via-[#030B1E] to-[#01040A] pointer-events-none" />

      {/* Radiant tricolor aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FF6B08]/15 via-sky-500/10 to-[#059669]/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Decorative Ashoka Chakra background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-[450px] h-[450px] text-sky-400 animate-[spin_80s_linear_infinite]" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="80" strokeWidth="0.75" strokeDasharray="3 4" />
          <circle cx="100" cy="100" r="60" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="15" strokeWidth="1" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 78 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={100 + 78 * Math.sin((i * 15 * Math.PI) / 180)}
              strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Animated Logo Container */}
        <div
          className={`transition-all duration-1000 transform ${
            stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-6'
          }`}
        >
          <VandeyaLogo size="xl" showText={false} className="mb-4" />
        </div>

        {/* Brand Name Typography */}
        <div
          className={`transition-all duration-700 delay-150 transform ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span>VANDEYA</span>
            <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400 font-serif">
              वंदेया
            </span>
          </h1>
        </div>

        {/* Tagline & Brand positioning */}
        <div
          className={`mt-2 transition-all duration-700 delay-300 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
            Connect India. Inspire the World.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-amber-300/90 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Proudly Made in India · भारत में निर्मित</span>
          </div>
        </div>

        {/* Loading Progress Indicator & Security Badge */}
        <div
          className={`mt-10 w-full flex flex-col items-center gap-3 transition-all duration-500 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Animated gradient progress bar */}
          <div className="w-56 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B08] via-white to-[#059669] transition-all duration-1000 ease-out"
              style={{ width: stage === 1 ? '35%' : stage === 2 ? '75%' : '100%' }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> E2E Encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> Indic AI Brain
            </span>
          </div>

          {/* Skip / Enter Button for immediate access */}
          <button
            onClick={onComplete}
            className="mt-4 px-5 py-2 text-xs font-semibold tracking-wide text-white/80 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-full transition-colors cursor-pointer"
          >
            Enter VANDEYA →
          </button>
        </div>
      </div>
    </div>
  );
};
