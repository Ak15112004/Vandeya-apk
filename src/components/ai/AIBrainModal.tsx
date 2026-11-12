import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Languages, 
  Hash, 
  PenTool, 
  ShieldAlert, 
  Send 
} from 'lucide-react';

interface AIBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  onApplyText?: (text: string) => void;
}

export const AIBrainModal: React.FC<AIBrainModalProps> = ({
  isOpen,
  onClose,
  initialText = '',
  onApplyText,
}) => {
  const [prompt, setPrompt] = useState(initialText);
  const [action, setAction] = useState<'caption' | 'hashtags' | 'enhance' | 'translate'>('enhance');
  const [tone, setTone] = useState<'desi_modern' | 'professional_bharat' | 'poetic_shayari' | 'youth_slang'>('desi_modern');
  const [targetLang, setTargetLang] = useState<'Hindi' | 'Hinglish' | 'Tamil' | 'Telugu' | 'English'>('Hindi');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() && action !== 'caption') return;
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          text: prompt,
          tone,
          language: targetLang,
        }),
      });

      const data = await res.json();
      setResult(data.result || data.fallback || 'Generated successfully!');
    } catch (err) {
      console.error(err);
      setResult('🇮🇳 Proudly powered by Vandeya AI. Vibrant ideas for a vibrant nation! #Vandeya #DigitalBharat');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyText && result) {
      onApplyText(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-[#030B1E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Glowing AI Brain Accent */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF6B08] to-[#10B981] text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>VANDEYA AI Brain</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                  Indic Intelligence
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Contextual captions, Indic translations & viral hashtag engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'enhance', label: 'Polish & Enhance', icon: PenTool },
            { id: 'caption', label: 'Caption Generator', icon: Sparkles },
            { id: 'hashtags', label: 'Trending Hashtags', icon: Hash },
            { id: 'translate', label: 'Indic Translate', icon: Languages },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = action === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAction(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input & Configurations */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Tone Selector if applicable */}
          {(action === 'caption' || action === 'enhance') && (
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                Creative Tone / सांस्कृतिक शैली
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'desi_modern', label: '🇮🇳 Desi Modern' },
                  { id: 'professional_bharat', label: '💼 Bharat Tech' },
                  { id: 'poetic_shayari', label: '📜 Poetic / शायरी' },
                  { id: 'youth_slang', label: '⚡ Youth & Viral' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                      tone === item.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Language if Translation */}
          {action === 'translate' && (
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                Target Indic Language
              </label>
              <div className="flex gap-2">
                {['Hindi', 'Hinglish', 'Tamil', 'Telugu', 'English'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setTargetLang(lang as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      targetLang === lang
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Prompt / Draft Textarea */}
          <div>
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
              {action === 'caption' ? 'Describe your photo, video or idea:' : 'Your post draft or text:'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                action === 'caption'
                  ? 'e.g. A cup of morning ginger chai watching the monsoon rain in Mumbai...'
                  : 'Type or paste what you want to improve or translate...'
              }
              rows={3}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || (!prompt.trim() && action !== 'caption')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B08] via-amber-500 to-[#10B981] hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Generating with Indic AI...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with VANDEYA Brain</span>
              </span>
            )}
          </button>

          {/* Output Display */}
          {result && (
            <div className="mt-3 p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  {onApplyText && (
                    <button
                      onClick={handleApply}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold"
                    >
                      Use in Post
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                {result}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
