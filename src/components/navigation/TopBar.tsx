import React, { useState } from 'react';
import { VandeyaLogo } from '../brand/VandeyaLogo';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  Bell, 
  Search, 
  LogIn, 
  LogOut, 
  Smartphone, 
  ChevronDown, 
  ShieldAlert,
  UserCheck,
  UserSearch,
  Lock,
  Flame
} from 'lucide-react';

interface TopBarProps {
  onOpenFriendSearch: () => void;
  onOpenTimeCapsule: () => void;
  onOpenAppIconModal: () => void;
  onOpenAdmin: () => void;
  onOpenNotifications: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenFriendSearch,
  onOpenTimeCapsule,
  onOpenAppIconModal,
  onOpenAdmin,
  onOpenNotifications,
}) => {
  const { currentUser, firebaseUser, isAdmin, signInWithGoogle, signOut, switchDemoUser, demoUsers } = useAuth();
  const { reports } = useSocial();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Count pending reports for owner alert
  const pendingReportsCount = reports.filter((r) => r.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030B1E]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <VandeyaLogo size="sm" showTagline={false} />
        </div>

        {/* Global Friend Search Bar (Opens Prominent Search Modal) */}
        <div
          onClick={onOpenFriendSearch}
          className="hidden md:flex flex-1 max-w-md relative mx-4 cursor-pointer group"
        >
          <div className="w-full bg-slate-900/90 hover:bg-slate-900 border border-slate-700/70 group-hover:border-amber-500/80 rounded-full pl-10 pr-4 py-2 text-xs text-slate-400 group-hover:text-slate-200 transition-all flex items-center justify-between shadow-inner">
            <span>Search citizens by Name, Username, or VANDEYA ID...</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-amber-400 font-mono">
              VD-ID
            </span>
          </div>
          <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenFriendSearch}
            className="md:hidden p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Search Citizens by Name / ID"
          >
            <UserSearch className="w-4 h-4 text-amber-400" />
          </button>

          {/* Time Capsule Launcher */}
          <button
            onClick={onOpenTimeCapsule}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
            title="Vandeya Time Capsule (Future Memories)"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Time Capsule</span>
          </button>

          {/* Android App Icon Showcase */}
          <button
            onClick={onOpenAppIconModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="View Official Android App Icon"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Owner Super Admin Control Center Trigger */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:brightness-125 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10"
              title="Founder & Owner Super Admin Control Panel"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Super Admin</span>
              {pendingReportsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[9px] animate-pulse">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span className="font-semibold text-amber-400">
                {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName.slice(0, 4)}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      language === lang.code ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B08]" />
          </button>

          {/* User Profile / Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/50 transition-all cursor-pointer"
            >
              <img
                src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.displayName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500/70"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 backdrop-blur-xl">
                {/* User info header */}
                <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                  <img
                    src={currentUser?.photoURL}
                    alt={currentUser?.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div className="overflow-hidden min-w-0">
                    <p className="text-sm font-bold text-white truncate flex items-center gap-1">
                      {currentUser?.displayName}
                      {currentUser?.isVerified && (
                        <span className="text-emerald-400 text-xs">✓</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 truncate">@{currentUser?.username}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                        {currentUser?.vandeyaId || 'VD-000000'}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Founder / Owner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Sign In option */}
                {!firebaseUser ? (
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      try {
                        await signInWithGoogle();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign in with Google
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full mt-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out ({firebaseUser.email?.slice(0, 16)}...)
                  </button>
                )}

                {/* Demo User Switcher (For testing User A / User B interactions, follow requests, blocking, and Super Admin) */}
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-amber-400" />
                    Quick Identity Switcher (Testing)
                  </div>
                  <div className="space-y-1 mt-1 max-h-44 overflow-y-auto pr-1">
                    {demoUsers.map((u) => (
                      <button
                        key={u.uid}
                        onClick={() => {
                          switchDemoUser(u.uid);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                          currentUser?.uid === u.uid ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <img src={u.photoURL} alt={u.displayName} className="w-5 h-5 rounded-full object-cover" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="truncate block leading-tight">{u.displayName}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{u.vandeyaId}</span>
                        </div>
                        {u.role === 'admin' && (
                          <span className="ml-auto text-[9px] text-amber-400 font-bold">Owner</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
