import React from 'react';
import { X, Heart, MessageCircle, UserPlus, Clock, ShieldCheck, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'like',
    actor: 'Priya Sharma 🇮🇳',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
    text: 'liked your post on Digital Sovereignty & Indic AI.',
    time: '5m ago',
    icon: Heart,
    color: 'text-rose-400',
  },
  {
    id: 'n2',
    type: 'follow',
    actor: 'Arjun Verma 🏔️',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    text: 'started following you on VANDEYA.',
    time: '25m ago',
    icon: UserPlus,
    color: 'text-amber-400',
  },
  {
    id: 'n3',
    type: 'comment',
    actor: 'Rohit Kulkarni 🏏',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    text: 'commented: "100% agreed! Super proud of Bharat deep-tech."',
    time: '2h ago',
    icon: MessageCircle,
    color: 'text-sky-400',
  },
  {
    id: 'n4',
    type: 'capsule',
    actor: 'VANDEYA Vault',
    avatar: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=100',
    text: 'Your Time Capsule "Milestone 2026" has been securely sealed.',
    time: '1d ago',
    icon: Clock,
    color: 'text-emerald-400',
  },
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#030B1E] border border-slate-700 rounded-3xl shadow-2xl p-5 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">Notifications</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              4 New
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-start gap-3 transition-colors"
              >
                <img
                  src={n.avatar}
                  alt={n.actor}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 text-xs">
                  <p className="text-slate-100">
                    <strong className="text-white font-bold">{n.actor}</strong> {n.text}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
                <div className={`p-1.5 rounded-full bg-slate-800 ${n.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
