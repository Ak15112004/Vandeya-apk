import React, { useState } from 'react';
import { SEED_USERS } from '../../data/seedData';
import { Search, TrendingUp, CheckCircle2, UserPlus, UserCheck, Flame, Hash, Compass } from 'lucide-react';

interface DiscoverProps {
  onSelectHashtag?: (tag: string) => void;
  onSelectCreator?: (userId: string) => void;
}

const TRENDING_TOPICS = [
  { tag: 'DigitalIndia', category: 'Technology · Trending', posts: '184.2K posts', rank: 1 },
  { tag: 'ISRO_Chandrayaan', category: 'Space & Science', posts: '96.5K posts', rank: 2 },
  { tag: 'StartupBharat', category: 'Entrepreneurship', posts: '74.1K posts', rank: 3 },
  { tag: 'VandeyaCreators', category: 'Social Revolution', posts: '68.9K posts', rank: 4 },
  { tag: 'IncredibleIndia', category: 'Heritage & Travel', posts: '53.0K posts', rank: 5 },
  { tag: 'CricketMeriJaan', category: 'Sports · Mumbai', posts: '44.8K posts', rank: 6 },
];

const EXPLORE_GRID_IMAGES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
];

export const Discover: React.FC<DiscoverProps> = ({ onSelectHashtag, onSelectCreator }) => {
  const [search, setSearch] = useState('');
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  const toggleFollow = (uid: string) => {
    setFollowedIds((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const filteredTopics = TRENDING_TOPICS.filter((t) =>
    t.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 sm:pb-8 px-3 sm:px-0">
      {/* Search Header */}
      <div className="bg-[#030B1E]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-lg">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Bharat: Creators, topics, #hashtags, cities..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Trending Bharat Topics */}
      <div className="bg-[#030B1E]/80 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF6B08]" />
            <h3 className="font-bold text-sm text-white">Trending across Bharat</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
            Live Updates
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filteredTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => onSelectHashtag?.(topic.tag)}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 rounded-xl px-2 transition-colors"
            >
              <div>
                <p className="text-[10px] text-slate-400">{topic.category}</p>
                <p className="text-xs font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                  <span className="text-amber-500 font-mono">#{topic.rank}</span>
                  <span>#{topic.tag}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{topic.posts}</p>
              </div>
              <Hash className="w-4 h-4 text-slate-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Creators Spotlight */}
      <div className="bg-[#030B1E]/80 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Inspiring Creators</h3>
          </div>
        </div>

        <div className="space-y-3">
          {SEED_USERS.map((user) => {
            const isFollowed = followedIds[user.uid];
            return (
              <div
                key={user.uid}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onSelectCreator?.(user.uid)}
                >
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/80"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">{user.displayName}</span>
                      {user.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">@{user.username}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{user.bio}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(user.uid)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isFollowed
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Mosaic Explore Gallery */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-white px-1">Visual Explorations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EXPLORE_GRID_IMAGES.map((src, i) => (
            <div
              key={i}
              className="relative h-36 rounded-xl overflow-hidden group cursor-pointer border border-slate-800"
            >
              <img
                src={src}
                alt="Explore"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[10px] text-white font-medium">Explore post →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
