import React from 'react';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type TabType = 'home' | 'discover' | 'create' | 'messages' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadMessagesCount = 1,
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home' as TabType, label: t('nav_home'), icon: Home },
    { id: 'discover' as TabType, label: t('nav_discover'), icon: Compass },
    { id: 'create' as TabType, label: t('nav_create'), icon: Plus, isCreate: true },
    { id: 'messages' as TabType, label: t('nav_messages'), icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'profile' as TabType, label: t('nav_profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#030B1E]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCreate) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="relative -top-3 p-3.5 rounded-full bg-gradient-to-tr from-[#FF6B08] via-amber-500 to-[#10B981] text-white shadow-[0_4px_20px_rgba(255,107,8,0.5)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label="Create Post"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-[#FF6B08] text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
