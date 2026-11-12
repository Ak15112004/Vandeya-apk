import React, { useState } from 'react';
import { UserProfile, Post, StoryHighlight } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Edit3, 
  TrendingUp, 
  Grid, 
  Bookmark, 
  Clock, 
  Sparkles, 
  Award, 
  DollarSign, 
  Users, 
  Eye, 
  Heart,
  Share2,
  Lock,
  Unlock,
  ShieldBan,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Copy,
  Check,
  Sliders,
  Plus
} from 'lucide-react';
import { SEED_HIGHLIGHTS } from '../../data/seedData';

interface ProfileViewProps {
  user?: UserProfile;
  userPosts: Post[];
  onOpenTimeCapsule?: () => void;
  onOpenReportModal?: (userId: string, userName: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user: profileUser,
  userPosts,
  onOpenTimeCapsule,
  onOpenReportModal,
}) => {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const { 
    isFollowing, 
    isRequested, 
    followUser, 
    unfollowUser, 
    blockUser, 
    unblockUser, 
    isUserBlockedByMe, 
    blockedUsers, 
    reports 
  } = useSocial();

  const user = profileUser || currentUser;

  const [activeTab, setActiveTab] = useState<'posts' | 'highlights' | 'analytics' | 'saved' | 'privacy'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [isPrivateAccount, setIsPrivateAccount] = useState(Boolean(user?.isPrivate));
  const [copiedId, setCopiedId] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const isOwner = currentUser?.uid === user.uid;
  const following = isFollowing(user.uid);
  const requested = isRequested(user.uid);
  const blockedByMe = isUserBlockedByMe(user.uid);

  // User's submitted reports
  const myReports = reports.filter((r) => r.reporterId === currentUser?.uid);

  const handleCopyVandeyaId = () => {
    navigator.clipboard?.writeText(user.vandeyaId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCurrentUserProfile({
      displayName: editName.trim(),
      bio: editBio.trim(),
      location: editLocation.trim(),
      isPrivate: isPrivateAccount,
    });
    setIsEditing(false);
  };

  const handleFollowToggle = () => {
    if (following) {
      unfollowUser(user.uid);
    } else {
      followUser(user);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 sm:pb-8 px-3 sm:px-0">
      {/* Profile Card Container */}
      <div className="bg-[#030B1E]/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner with Indian Cultural Horizon */}
        <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={user.bannerURL || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030B1E] via-transparent to-black/30" />
        </div>

        {/* Profile Info Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar with Saffron-Green Status Halo */}
            <div className="relative inline-block">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-[#FF6B08] via-white to-[#10B981] shadow-xl">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover border-4 border-[#030B1E]"
                />
              </div>
              {user.isVerified && (
                <div
                  className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md"
                  title="Bharat Verified"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwner ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              ) : (
                <>
                  {blockedByMe ? (
                    <button
                      onClick={() => unblockUser(user.uid)}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unblock</span>
                    </button>
                  ) : following ? (
                    <button
                      onClick={handleFollowToggle}
                      className="px-4 py-2 rounded-full bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Following</span>
                    </button>
                  ) : requested ? (
                    <button
                      onClick={handleFollowToggle}
                      className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Requested</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowToggle}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </button>
                  )}

                  {/* Menu with Block & Report Options */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-1.5 z-40 text-xs text-slate-200">
                        {blockedByMe ? (
                          <button
                            onClick={() => {
                              unblockUser(user.uid);
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-emerald-400"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unblock Citizen</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm(`Block ${user.displayName}? They won't see your profile or send you messages.`)) {
                                blockUser(user.uid);
                              }
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                          >
                            <ShieldBan className="w-3.5 h-3.5" />
                            <span>Block Citizen</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onOpenReportModal?.(user.uid, user.displayName);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Report Profile</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Form if toggled */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 mb-4">
              <h4 className="text-xs font-bold uppercase text-amber-400">Update Profile Details</h4>
              <div>
                <label className="text-[10px] text-slate-400 uppercase">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase">City / Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Private Account</span>
                  <span className="text-[10px] text-slate-400">Require approval for new followers</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateAccount}
                  onChange={(e) => setIsPrivateAccount(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{user.displayName}</h2>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    Super Admin
                  </span>
                )}
                {/* Unique VANDEYA ID with Click to Copy */}
                <button
                  onClick={handleCopyVandeyaId}
                  className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copy Unique VANDEYA Citizen ID"
                >
                  <span>{user.vandeyaId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400">@{user.username}</p>
                {user.isPrivate && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.2 rounded">
                    <Lock className="w-2.5 h-2.5 text-amber-400" /> Private Account
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-200 mt-2.5 max-w-xl leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>

              {/* Mutual followers preview */}
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                <span>Followed by</span>
                <strong className="text-white">priyasharma_ai</strong>
                <span>and 14 others</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Joined {new Date(user.createdAt).getFullYear()}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Award className="w-3.5 h-3.5" /> Sovereign ID Certified
                </span>
              </div>
            </div>
          )}

          {/* Social Numbers Row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="font-extrabold text-sm text-white">{user.followersCount.toLocaleString()}</span>{' '}
              <span className="text-slate-400">Followers</span>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">{user.followingCount.toLocaleString()}</span>{' '}
              <span className="text-slate-400">Following</span>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">{user.postsCount || userPosts.length}</span>{' '}
              <span className="text-slate-400">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Story Highlights Bar */}
      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300">Story Highlights</span>
          {isOwner && (
            <button className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <Plus className="w-3 h-3" /> New Highlight
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
          {SEED_HIGHLIGHTS.map((hl) => (
            <div key={hl.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full p-[2px] bg-slate-700 group-hover:border-amber-400 transition-all">
                <img src={hl.coverUrl} alt={hl.title} className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-slate-300 mt-1 max-w-[70px] truncate">
                {hl.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'posts', label: 'Posts', icon: Grid },
          { id: 'analytics', label: 'Creator Analytics', icon: TrendingUp },
          { id: 'saved', label: 'Bookmarks', icon: Bookmark },
          { id: 'privacy', label: 'Privacy & Blocked', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Posts Grid */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No posts published yet.</div>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-200 line-clamp-3">{post.content}</p>
                {post.mediaUrl && (
                  <img src={post.mediaUrl} alt="" className="mt-2 rounded-xl max-h-48 w-full object-cover" />
                )}
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>❤️ {post.likesCount}</span>
                  <span>💬 {post.commentsCount}</span>
                  <span>🔁 {post.repostsCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Creator Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="bg-[#030B1E]/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Creator Universe Verified Metrics
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              30-Day Growth
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-sky-400" /> Total Impressions
              </p>
              <p className="text-lg font-black text-white mt-1">482.5K</p>
              <span className="text-[10px] text-emerald-400 font-bold">+28.4% vs last mo.</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" /> Engagements
              </p>
              <p className="text-lg font-black text-white mt-1">64.2K</p>
              <span className="text-[10px] text-emerald-400 font-bold">+14.2%</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-400" /> New Followers
              </p>
              <p className="text-lg font-black text-white mt-1">+1,840</p>
              <span className="text-[10px] text-emerald-400 font-bold">Organic</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Bharat Creator Fund
              </p>
              <p className="text-lg font-black text-white mt-1">₹34,500</p>
              <span className="text-[10px] text-slate-400">Verified Payouts</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Saved Bookmarks */}
      {activeTab === 'saved' && (
        <div className="p-6 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          <Bookmark className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p>Posts you save on VANDEYA are privately stored here.</p>
        </div>
      )}

      {/* Tab 4: Privacy Settings, Blocked Citizens & My Reports */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          {/* Blocked Users Section (Mandatory Feature) */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <ShieldBan className="w-4 h-4 text-rose-400" /> Blocked Citizens ({blockedUsers.length})
            </h4>
            <p className="text-[11px] text-slate-400">
              Blocked citizens cannot message you or see your content. Unblocking will restore your conversation history without automatically re-following.
            </p>

            {blockedUsers.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No users currently blocked.</p>
            ) : (
              <div className="space-y-2">
                {blockedUsers.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 font-mono">User ID: {b.blockedId}</span>
                    <button
                      onClick={() => unblockUser(b.blockedId)}
                      className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Submitted Reports Status Tracker */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Your Submitted Safety Reports ({myReports.length})
            </h4>

            {myReports.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">You haven't submitted any reports.</p>
            ) : (
              <div className="space-y-2">
                {myReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white capitalize">{r.category.replace('_', ' ')}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Action Taken'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : r.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-slate-400">{r.description}</p>
                    {r.decision && (
                      <p className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg">
                        <strong>Resolution:</strong> {r.decision}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
