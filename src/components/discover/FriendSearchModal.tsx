import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { UserProfile } from '../../types';
import { 
  Search, 
  X, 
  UserCheck, 
  UserPlus, 
  Clock, 
  History, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ShieldBan
} from 'lucide-react';

interface FriendSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
}

export const FriendSearchModal: React.FC<FriendSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const { currentUser } = useAuth();
  const { 
    allUsers, 
    isFollowing, 
    isRequested, 
    followUser, 
    unfollowUser, 
    isUserBlockedByMe, 
    isUserBlockingMe 
  } = useSocial();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'VD-782410',
    'priyasharma_ai',
    'Arjun Verma',
  ]);

  if (!isOpen) return null;

  // Filter users matching Full Name, Username, or VANDEYA ID
  const cleanQ = query.trim().toLowerCase();
  const filteredUsers = allUsers.filter((u) => {
    // Cannot search self
    if (u.uid === currentUser?.uid) return false;
    // Block rules: if either blocked the other, hide from normal search
    if (isUserBlockedByMe(u.uid) || isUserBlockingMe(u.uid)) return false;

    if (!cleanQ) return true; // Show suggested users when search query is empty

    return (
      u.displayName.toLowerCase().includes(cleanQ) ||
      u.username.toLowerCase().includes(cleanQ) ||
      u.vandeyaId.toLowerCase().includes(cleanQ)
    );
  });

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleFollowAction = (user: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing(user.uid)) {
      unfollowUser(user.uid);
    } else {
      followUser(user);
      if (!recentSearches.includes(user.displayName)) {
        setRecentSearches([user.displayName, ...recentSearches.slice(0, 4)]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-[#030B1E] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header with Search Input */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Find Citizens across Bharat</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Full Name, @username, or unique VANDEYA ID (e.g. VD-782410)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Recent Searches Pills */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase flex-shrink-0">
              <History className="w-3 h-3 text-amber-400" /> Recent:
            </span>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => handleSelectRecent(term)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                <span>{term}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-bold uppercase">
            <span>{query ? 'Search Results' : 'Suggested Citizens for You'}</span>
            <span>{filteredUsers.length} found</span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <p>No citizens found matching "{query}"</p>
              <p className="text-[11px] text-slate-500">
                Tip: Try searching for a unique ID like "VD-782410" or "priyasharma_ai".
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredUsers.map((user) => {
                const following = isFollowing(user.uid);
                const requested = isRequested(user.uid);

                return (
                  <div
                    key={user.uid}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-11 h-11 rounded-full object-cover border border-amber-400/80"
                        />
                        {user.isPrivate && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">
                            {user.displayName}
                          </span>
                          {user.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          )}
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-amber-300">
                            {user.vandeyaId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{user.bio}</p>
                      </div>
                    </div>

                    {/* Follow Action Button */}
                    <div className="flex-shrink-0">
                      {following ? (
                        <button
                          onClick={(e) => handleFollowAction(user, e)}
                          className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700 flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Following</span>
                        </button>
                      ) : requested ? (
                        <button
                          onClick={(e) => handleFollowAction(user, e)}
                          className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold transition-all cursor-pointer border border-amber-500/40 flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Requested</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleFollowAction(user, e)}
                          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
