import React, { useState } from 'react';
import { Post, Story } from '../../types';
import { StoriesTray } from './StoriesTray';
import { PostCard } from './PostCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Image, BarChart2, TrendingUp, Cpu, Landmark, ShieldCheck } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  stories: Story[];
  onOpenCreate: () => void;
  onOpenAIBrain: () => void;
  onLikeToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onAddStory: () => void;
  onReportPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  stories,
  onOpenCreate,
  onOpenAIBrain,
  onLikeToggle,
  onAddComment,
  onVotePoll,
  onAddStory,
  onReportPost,
  onDeletePost,
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'for_you' | 'following' | 'trending' | 'tech' | 'culture'>('for_you');

  // Filter posts based on active tab
  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'for_you') return true;
    if (activeFilter === 'following') return p.authorId !== currentUser?.uid;
    if (activeFilter === 'trending') return p.likesCount > 4000;
    if (activeFilter === 'tech') return p.hashtags?.some((h) => ['AIinIndia', 'StartupBharat', 'DeepTech', 'TechIndia'].includes(h));
    if (activeFilter === 'culture') return p.hashtags?.some((h) => ['IncredibleIndia', 'TravelBharat', 'LadakhDiaries'].includes(h));
    return true;
  });

  const filterTabs = [
    { id: 'for_you' as const, label: t('feed_for_you'), icon: Sparkles },
    { id: 'trending' as const, label: t('feed_trending'), icon: TrendingUp },
    { id: 'tech' as const, label: t('feed_tech'), icon: Cpu },
    { id: 'culture' as const, label: t('feed_culture'), icon: Landmark },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-20 sm:pb-8">
      {/* 24-hour Ephemeral Stories Tray */}
      <StoriesTray stories={stories} onAddStory={onAddStory} />

      {/* Quick Create Bar (Vandeya Studio Launcher) */}
      <div className="bg-[#030B1E]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3.5 mx-3 sm:mx-0 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
          />
          <button
            onClick={onOpenCreate}
            className="flex-1 text-left bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 rounded-full px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            {t('create_post_placeholder')}
          </button>
        </div>

        {/* Studio Quick Actions */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-emerald-400 font-medium transition-colors cursor-pointer"
          >
            <Image className="w-4 h-4" />
            <span>Media</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-sky-400 font-medium transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Poll</span>
          </button>

          <button
            onClick={onOpenAIBrain}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-300 font-semibold hover:brightness-125 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Brain</span>
          </button>
        </div>
      </div>

      {/* Feed Filters Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 sm:px-0">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4 px-3 sm:px-0">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-[#030B1E]/60 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No posts in this stream yet.</p>
            <button
              onClick={onOpenCreate}
              className="mt-3 px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Be the first to publish
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeToggle={onLikeToggle}
              onAddComment={onAddComment}
              onVotePoll={onVotePoll}
              onReportPost={onReportPost}
              onDeletePost={onDeletePost}
            />
          ))
        )}
      </div>

      {/* Bottom Feed Sovereignty End Note */}
      <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>You are all caught up on VANDEYA Bharat Feed</span>
      </div>
    </div>
  );
};
