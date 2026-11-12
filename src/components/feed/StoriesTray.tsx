import React, { useState, useEffect } from 'react';
import { Story } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Heart, Send, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoriesTrayProps {
  stories: Story[];
  onAddStory: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({ stories, onAddStory }) => {
  const { currentUser } = useAuth();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Auto-advance story timer
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="w-full bg-[#030B1E]/40 border-b border-slate-800/60 py-3.5 px-3">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Your Story / Add Story button */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group" onClick={onAddStory}>
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-slate-800 hover:ring-2 hover:ring-amber-500 transition-all">
            <img
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Your story"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-gradient-to-tr from-[#FF6B08] to-[#10B981] text-white border-2 border-[#030B1E]">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-1 max-w-[68px] truncate">
            Your Story
          </span>
        </div>

        {/* Stories from creators */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => {
              setActiveStoryIndex(idx);
              setProgress(0);
            }}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
          >
            {/* Tricolor Glowing Gradient Ring */}
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FF6B08] via-white/80 to-[#10B981] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(255,107,8,0.3)]">
              <div className="w-full h-full rounded-full p-[1.5px] bg-[#030B1E]">
                <img
                  src={story.authorPhotoURL}
                  alt={story.authorName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200 mt-1 max-w-[68px] truncate">
              {story.authorName}
            </span>
          </div>
        ))}
      </div>

      {/* Fullscreen Interactive Story Viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800">
            {/* Top Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex gap-1.5 w-full">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{
                        width:
                          i < (activeStoryIndex ?? 0)
                            ? '100%'
                            : i === activeStoryIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between mt-3 text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={activeStory.authorPhotoURL}
                    alt={activeStory.authorName}
                    className="w-8 h-8 rounded-full border border-amber-400 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold leading-none">{activeStory.authorName}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Vandeya Story</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Media (Image/Video) */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.caption || 'Story'}
                className="w-full h-full object-cover select-none"
              />

              {/* Navigation Click Zones */}
              <div
                className="absolute left-0 top-16 bottom-20 w-1/3 z-10 cursor-pointer"
                onClick={() => {
                  if (activeStoryIndex && activeStoryIndex > 0) {
                    setActiveStoryIndex(activeStoryIndex - 1);
                    setProgress(0);
                  }
                }}
              />
              <div
                className="absolute right-0 top-16 bottom-20 w-1/3 z-10 cursor-pointer"
                onClick={() => {
                  if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
                    setActiveStoryIndex(activeStoryIndex + 1);
                    setProgress(0);
                  } else {
                    setActiveStoryIndex(null);
                  }
                }}
              />

              {/* Left / Right chevron buttons */}
              {activeStoryIndex !== null && activeStoryIndex > 0 && (
                <button
                  onClick={() => {
                    setActiveStoryIndex(activeStoryIndex - 1);
                    setProgress(0);
                  }}
                  className="hidden sm:block absolute left-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeStoryIndex !== null && activeStoryIndex < stories.length - 1 && (
                <button
                  onClick={() => {
                    setActiveStoryIndex(activeStoryIndex + 1);
                    setProgress(0);
                  }}
                  className="hidden sm:block absolute right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Caption Overlay */}
              {activeStory.caption && (
                <div className="absolute bottom-20 left-4 right-4 z-20 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
                  {activeStory.caption}
                </div>
              )}
            </div>

            {/* Bottom Interaction Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Reply to ${activeStory.authorName}...`}
                  className="w-full bg-white/20 text-white placeholder-white/70 text-xs rounded-full pl-3 pr-8 py-2 border border-white/20 focus:outline-none focus:bg-white/30"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Reactions */}
              <div className="flex items-center gap-1">
                {['🇮🇳', '❤️', '🔥', '👏'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      // Trigger small visual reaction
                    }}
                    className="p-1 text-base hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
