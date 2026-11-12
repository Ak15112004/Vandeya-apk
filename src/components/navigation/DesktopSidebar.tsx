import React from 'react';
import { 
  Home, 
  Compass, 
  MessageCircle, 
  User, 
  PlusCircle, 
  Clock, 
  Film, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ShieldAlert,
  UserSearch
} from 'lucide-react';
import { TabType } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface DesktopSidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreate: () => void;
  onOpenAIBrain: () => void;
  onOpenTimeCapsule: () => void;
  onOpenShorts: () => void;
  onOpenAdmin: () => void;
  onOpenFriendSearch: () => void;
  unreadMessagesCount?: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreate,
  onOpenAIBrain,
  onOpenTimeCapsule,
  onOpenShorts,
  onOpenAdmin,
  onOpenFriendSearch,
  unreadMessagesCount = 1,
}) => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const mainLinks = [
    { id: 'home' as TabType, label: t('nav_home'), icon: Home },
    { id: 'discover' as TabType, label: t('nav_discover'), icon: Compass },
    { id: 'messages' as TabType, label: t('nav_messages'), icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'profile' as TabType, label: t('nav_profile'), icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-60px)] sticky top-[57px] py-4 px-3 border-r border-slate-800/80 bg-[#030B1E]/60 backdrop-blur-md justify-between">
      <div className="space-y-5">
        {/* Main Navigation Links */}
        <div className="space-y-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#FF6B08] text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Quick Friend Search */}
          <button
            onClick={onOpenFriendSearch}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            <UserSearch className="w-5 h-5 text-amber-400" />
            <span>Find Citizens</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400 font-mono">
              ID
            </span>
          </button>
        </div>

        {/* Vandeya Super-App Innovations */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Social Universe
          </p>
          <div className="space-y-1">
            <button
              onClick={onOpenShorts}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Film className="w-4 h-4 text-emerald-400" />
              <span>Vandeya Reels</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Watch
              </span>
            </button>

            <button
              onClick={onOpenAIBrain}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Indic AI Brain</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                Smart
              </span>
            </button>

            <button
              onClick={onOpenTimeCapsule}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-sky-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Time Capsule</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer border border-amber-500/30"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Super Admin Hub</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                  Owner
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Create Button */}
        <button
          onClick={onOpenCreate}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF6B08] via-amber-500 to-[#10B981] hover:brightness-110 text-white font-bold text-sm shadow-[0_4px_20px_rgba(255,107,8,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('btn_publish')}</span>
        </button>
      </div>

      {/* Footer Branding & Sovereignty Badge */}
      <div className="pt-4 border-t border-slate-800/80 px-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400/90 font-medium">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Proudly Made in India 🇮🇳</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Zero-Trust Sovereign Privacy</span>
        </p>
      </div>
    </aside>
  );
};
