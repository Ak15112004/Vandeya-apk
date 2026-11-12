import React, { useState } from 'react';
import { Post, ReportCategory } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { X, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPost?: Post | null;
  targetUserId?: string | null;
  targetUserName?: string | null;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  targetPost,
  targetUserId,
  targetUserName,
}) => {
  const { submitReport } = useSocial();
  const [category, setCategory] = useState<ReportCategory>('spam');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reportedId = targetUserId || targetPost?.authorId || 'unknown_user';
  const reportedName = targetUserName || targetPost?.authorName || 'Citizen';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitReport(reportedId, reportedName, category, description.trim(), targetPost?.id);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#030B1E] border border-rose-500/40 rounded-3xl shadow-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base">VANDEYA Safety Guardian</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Report Submitted to Owner Admin</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Our 24/7 sovereign safety moderation team and cyber-defense system will review this report against community standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-300">
              Report against: <strong className="text-white">{reportedName}</strong>
            </p>

            {targetPost && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 line-clamp-2">
                "{targetPost.content}" — by {targetPost.authorName}
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Select Safety Violation
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="spam">Spam or Misleading Content</option>
                <option value="scam">Scam Link / Financial Fraud Attempt</option>
                <option value="harassment">Cyberbullying or Harassment</option>
                <option value="threats">Threats or Violence</option>
                <option value="fake_account">Fake Account or Impersonation</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="copyright">Copyright Violation</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Description of Violation
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what violates platform rules (evidence or timestamps)..."
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!description.trim()}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              Submit Report to Super Admin
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
