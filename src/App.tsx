import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocialProvider, useSocial } from './context/SocialContext';
import { LanguageProvider } from './context/LanguageContext';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav, TabType } from './components/navigation/BottomNav';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { Feed } from './components/feed/Feed';
import { Discover } from './components/discover/Discover';
import { Messenger } from './components/messages/Messenger';
import { ProfileView } from './components/profile/ProfileView';
import { CreatePostModal } from './components/create/CreatePostModal';
import { AIBrainModal } from './components/ai/AIBrainModal';
import { TimeCapsuleModal } from './components/capsule/TimeCapsuleModal';
import { VandeyaShortsModal } from './components/shorts/VandeyaShortsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppIconModal } from './components/brand/AppIconModal';
import { NotificationsModal } from './components/navigation/NotificationsModal';
import { SafetyModal } from './components/safety/SafetyModal';
import { SplashScreen } from './components/brand/SplashScreen';
import { FriendSearchModal } from './components/discover/FriendSearchModal';
import { 
  SEED_POSTS, 
  SEED_STORIES, 
  SEED_CONVERSATIONS, 
  SEED_TIME_CAPSULES 
} from './data/seedData';
import { Post, Story, TimeCapsule, UserProfile } from './types';
import { ShieldBan, AlertTriangle } from 'lucide-react';

function MainApp() {
  const { currentUser } = useAuth();
  const { isUserSuspended, suspendedUsersMap } = useSocial();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Core Data State
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>(SEED_TIME_CAPSULES);

  // Selected Profile for Navigation
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);

  // Modals Visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIBrainOpen, setIsAIBrainOpen] = useState(false);
  const [aiInitialText, setAiInitialText] = useState('');
  const [aiInsertCallback, setAiInsertCallback] = useState<((text: string) => void) | null>(null);

  const [isFriendSearchOpen, setIsFriendSearchOpen] = useState(false);
  const [isTimeCapsuleOpen, setIsTimeCapsuleOpen] = useState(false);
  const [isShortsOpen, setIsShortsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAppIconOpen, setIsAppIconOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Safety reporting state
  const [safetyTarget, setSafetyTarget] = useState<{
    post?: Post | null;
    userId?: string | null;
    userName?: string | null;
  } | null>(null);

  // Post Interaction Handlers
  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.likedByCurrentUser;
          return {
            ...p,
            likedByCurrentUser: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, _text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          const updatedOptions = p.poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
            },
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'createdAt'>) => {
    const created: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      likesCount: 1,
      commentsCount: 0,
      repostsCount: 0,
      likedByCurrentUser: true,
      createdAt: new Date().toISOString(),
    };
    setPosts([created, ...posts]);
    setActiveTab('home');
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleAddStory = () => {
    if (!currentUser) return;
    const newStory: Story = {
      id: `story_${Date.now()}`,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorPhotoURL: currentUser.photoURL,
      mediaUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      caption: 'Proudly sharing a moment on VANDEYA 🇮🇳✨',
      viewers: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    setStories([newStory, ...stories]);
  };

  const handleAddTimeCapsule = (newCapsule: Omit<TimeCapsule, 'id' | 'createdAt' | 'isUnlocked'>) => {
    const created: TimeCapsule = {
      ...newCapsule,
      id: `capsule_${Date.now()}`,
      isUnlocked: false,
      createdAt: new Date().toISOString(),
    };
    setTimeCapsules([created, ...timeCapsules]);
  };

  const handleTriggerAIAssistant = (currentText: string, onInsert: (text: string) => void) => {
    setAiInitialText(currentText);
    setAiInsertCallback(() => onInsert);
    setIsAIBrainOpen(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Check if current user is suspended (Test Scenario 12)
  const isCurrentSuspended = currentUser ? isUserSuspended(currentUser.uid) : false;
  const suspensionInfo = currentUser ? suspendedUsersMap[currentUser.uid] : null;

  return (
    <div className="min-h-screen bg-[#030B1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Bar */}
      <TopBar
        onOpenFriendSearch={() => setIsFriendSearchOpen(true)}
        onOpenTimeCapsule={() => setIsTimeCapsuleOpen(true)}
        onOpenAppIconModal={() => setIsAppIconOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Account Suspended Notice Banner if user is currently suspended */}
      {isCurrentSuspended && (
        <div className="bg-rose-950 border-b border-rose-800 p-3 text-center text-xs text-rose-200 flex items-center justify-center gap-2">
          <ShieldBan className="w-4 h-4 text-rose-400" />
          <span>
            <strong>Account Temporarily Suspended by Super Admin:</strong>{' '}
            {suspensionInfo?.reason || 'Terms violation'}. Restricted operations are locked until{' '}
            {suspensionInfo?.until === 'permanent' ? 'Permanent' : new Date(suspensionInfo?.until || '').toLocaleDateString()}.
          </span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex justify-center">
        {/* Desktop Left Sidebar */}
        <DesktopSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'profile') setInspectedUser(null);
            setActiveTab(tab);
          }}
          onOpenCreate={() => {
            if (isCurrentSuspended) {
              alert('Account is suspended. You cannot publish posts.');
              return;
            }
            setIsCreateOpen(true);
          }}
          onOpenAIBrain={() => {
            setAiInitialText('');
            setAiInsertCallback(null);
            setIsAIBrainOpen(true);
          }}
          onOpenTimeCapsule={() => setIsTimeCapsuleOpen(true)}
          onOpenShorts={() => setIsShortsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenFriendSearch={() => setIsFriendSearchOpen(true)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 max-w-3xl min-w-0 py-4 px-2 sm:px-4">
          {activeTab === 'home' && (
            <Feed
              posts={posts}
              stories={stories}
              onOpenCreate={() => {
                if (isCurrentSuspended) {
                  alert('Account is suspended. You cannot publish posts.');
                  return;
                }
                setIsCreateOpen(true);
              }}
              onOpenAIBrain={() => {
                setAiInitialText('');
                setAiInsertCallback(null);
                setIsAIBrainOpen(true);
              }}
              onLikeToggle={handleLikeToggle}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onAddStory={handleAddStory}
              onReportPost={(post) => setSafetyTarget({ post })}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeTab === 'discover' && (
            <Discover
              onSelectHashtag={(_tag) => setActiveTab('home')}
              onSelectCreator={(userId) => {
                const found = SEED_POSTS.find((p) => p.authorId === userId);
                if (found) {
                  setInspectedUser({
                    uid: found.authorId,
                    vandeyaId: 'VD-992102',
                    email: `${found.authorUsername}@vandeya.in`,
                    displayName: found.authorName,
                    username: found.authorUsername,
                    bio: 'Inspiring creator on VANDEYA.',
                    photoURL: found.authorPhotoURL,
                    bannerURL: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200',
                    isVerified: Boolean(found.authorVerified),
                    isPrivate: false,
                    role: 'creator',
                    language: 'en',
                    followersCount: 84000,
                    followingCount: 300,
                    postsCount: 120,
                    createdAt: '2026-01-01T00:00:00.000Z',
                  });
                  setActiveTab('profile');
                }
              }}
            />
          )}

          {activeTab === 'create' && (
            <div className="py-8 text-center">
              <button
                onClick={() => {
                  if (isCurrentSuspended) {
                    alert('Account is suspended. You cannot publish posts.');
                    return;
                  }
                  setIsCreateOpen(true);
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B08] to-[#10B981] text-white font-bold"
              >
                Open VANDEYA Studio Composer
              </button>
            </div>
          )}

          {activeTab === 'messages' && (
            <Messenger
              conversations={SEED_CONVERSATIONS}
              onSendMessage={(_convId, _text) => {}}
              onOpenReportModal={(userId, userName) => setSafetyTarget({ userId, userName })}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={inspectedUser || currentUser || undefined}
              userPosts={posts.filter(
                (p) => p.authorId === (inspectedUser?.uid || currentUser?.uid) || p.authorId === 'vandeya_creator_guest'
              )}
              onOpenTimeCapsule={() => setIsTimeCapsuleOpen(true)}
              onOpenReportModal={(userId, userName) => setSafetyTarget({ userId, userName })}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'create') {
            if (isCurrentSuspended) {
              alert('Account is suspended. You cannot publish posts.');
              return;
            }
            setIsCreateOpen(true);
          } else {
            if (tab === 'profile') setInspectedUser(null);
            setActiveTab(tab);
          }
        }}
        unreadMessagesCount={1}
      />

      {/* Modals & Fullscreen Overlays */}
      <FriendSearchModal
        isOpen={isFriendSearchOpen}
        onClose={() => setIsFriendSearchOpen(false)}
        onSelectUser={(user) => {
          setInspectedUser(user);
          setActiveTab('profile');
        }}
      />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitPost={handleCreatePost}
        onTriggerAIAssistant={handleTriggerAIAssistant}
      />

      <AIBrainModal
        isOpen={isAIBrainOpen}
        onClose={() => setIsAIBrainOpen(false)}
        initialText={aiInitialText}
        onApplyText={(enhanced) => {
          if (aiInsertCallback) {
            aiInsertCallback(enhanced);
          }
        }}
      />

      <TimeCapsuleModal
        isOpen={isTimeCapsuleOpen}
        onClose={() => setIsTimeCapsuleOpen(false)}
        capsules={timeCapsules}
        onAddCapsule={handleAddTimeCapsule}
      />

      <VandeyaShortsModal
        isOpen={isShortsOpen}
        onClose={() => setIsShortsOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        posts={posts}
        onDeletePost={handleDeletePost}
      />

      <AppIconModal
        isOpen={isAppIconOpen}
        onClose={() => setIsAppIconOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SafetyModal
        isOpen={Boolean(safetyTarget)}
        onClose={() => setSafetyTarget(null)}
        targetPost={safetyTarget?.post}
        targetUserId={safetyTarget?.userId}
        targetUserName={safetyTarget?.userName}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocialProvider>
          <MainApp />
        </SocialProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
