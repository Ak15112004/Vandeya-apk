import React from 'react';
import { VandeyaAppIcon } from './VandeyaAppIcon';
import { X, Smartphone, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AppIconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppIconModal: React.FC<AppIconModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#030B1E] border border-slate-700 rounded-3xl shadow-2xl p-6 text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">VANDEYA Android App Icon</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master 512px Play Store Preview */}
        <div className="flex flex-col items-center justify-center py-4">
          <VandeyaAppIcon size={140} />
          <p className="font-bold text-sm text-white mt-4 flex items-center gap-1.5">
            <span>VANDEYA</span>
            <span className="text-amber-400 font-serif">वंदेया</span>
          </p>
          <p className="text-xs text-slate-400">Android Launcher Master Asset (Adaptive Squircle)</p>
        </div>

        {/* Multi-Size Scalability Preview */}
        <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Scalability & Contrast Check (Android OS Sizes)
          </span>
          <div className="flex items-center justify-around py-2">
            <div className="flex flex-col items-center gap-1">
              <VandeyaAppIcon size={72} withGlow={false} />
              <span className="text-[10px] text-slate-400">72px (xxhdpi)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <VandeyaAppIcon size={48} withGlow={false} />
              <span className="text-[10px] text-slate-400">48px (xhdpi)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <VandeyaAppIcon size={32} withGlow={false} />
              <span className="text-[10px] text-slate-400">32px (mdpi)</span>
            </div>
          </div>
        </div>

        {/* Design Philosophy */}
        <div className="text-xs text-slate-300 space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Design Anatomy
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
            <li><strong>Central Glowing V:</strong> Ascending digital wings with saffron and emerald gradients.</li>
            <li><strong>Ashoka Watermark:</strong> 24-ray harmonic chakra geometry symbolizing relentless progress.</li>
            <li><strong>Deep India Navy:</strong> Represents sovereignty, security, and global dignity.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};
