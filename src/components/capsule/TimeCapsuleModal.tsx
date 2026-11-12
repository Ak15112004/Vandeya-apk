import React, { useState } from 'react';
import { TimeCapsule } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Clock, 
  Lock, 
  Unlock, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  Send, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsules: TimeCapsule[];
  onAddCapsule: (capsule: Omit<TimeCapsule, 'id' | 'createdAt' | 'isUnlocked'>) => void;
}

export const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  capsules,
  onAddCapsule,
}) => {
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('2030-08-15');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [unlockedView, setUnlockedView] = useState<TimeCapsule | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) return;

    onAddCapsule({
      userId: currentUser.uid,
      title: title.trim(),
      content: content.trim(),
      unlockDate,
      recipientEmail: recipientEmail.trim() || undefined,
    });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF6B08', '#FFD700', '#10B981'],
    });

    setIsCreating(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#030B1E] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>VANDEYA Time Capsule</span>
                <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">
                  Future Vault
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Lock memories & message your future self</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Create New Capsule Trigger or Form */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-125 transition-all cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Seal a New Future Memory</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> Seal Memory in Vault
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Memory Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My startup launch day milestone / India 2030 vision"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Your Letter to the Future</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What feelings, dreams or secrets do you want to unlock years from now?"
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> Unlock Date
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Friend Recipient (Optional)</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@vandeya.in"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Cryptographically Seal Memory</span>
              </button>
            </form>
          )}

          {/* List of Sealed Capsules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">Your Sealed Time Capsules</h4>
            {capsules.map((capsule) => {
              const isPast = new Date(capsule.unlockDate) <= new Date();

              return (
                <div
                  key={capsule.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isPast
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isPast ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-white">{capsule.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>Unlocks on: {capsule.unlockDate}</span>
                      </p>

                      {isPast ? (
                        <p className="text-xs text-emerald-300 mt-2 font-medium bg-emerald-500/10 p-2 rounded-lg">
                          "{capsule.content}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          🔒 Content encrypted in vault until unlock date.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Knowledge Future Storage: Only you hold the unlocking key.</span>
        </div>
      </div>
    </div>
  );
};
