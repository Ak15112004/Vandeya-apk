import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useLanguage } from '../../context/LanguageContext';
import { Post } from '../../types';
import { 
  X, 
  Image as ImageIcon, 
  BarChart2, 
  Sparkles, 
  Globe2, 
  Users, 
  Lock, 
  MapPin, 
  Plus, 
  Trash2, 
  Send,
  Tag,
  Check
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'createdAt'>) => void;
  onTriggerAIAssistant: (currentText: string, onInsert: (text: string) => void) => void;
}

const SAMPLE_MEDIA_LIBRARY = [
  { label: 'India Gate / Pride', url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000' },
  { label: 'Himalayan Peaks', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000' },
  { label: 'Varanasi Ghats', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000' },
  { label: 'Tech & Innovation', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000' },
  { label: 'Cricket Stadium', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000' },
  { label: 'Traditional Dance & Art', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
  onTriggerAIAssistant,
}) => {
  const { currentUser } = useAuth();
  const { allUsers } = useSocial();
  const { t } = useLanguage();

  const [content, setContent] = useState('');
  const [selectedMediaList, setSelectedMediaList] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [audience, setAudience] = useState<'public' | 'followers' | 'close_friends'>('public');
  const [location, setLocation] = useState('New Delhi, India');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [taggedUserHandle, setTaggedUserHandle] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedMediaList.length === 0) return;

    // Extract hashtags
    const hashtags = content.match(/#[a-zA-Z0-9_]+/g)?.map((tag) => tag.replace('#', '')) || [];

    const postData: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'createdAt'> = {
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorUsername: currentUser.username,
      authorPhotoURL: currentUser.photoURL,
      authorVerified: currentUser.isVerified,
      content: content.trim(),
      mediaUrl: selectedMediaList[0] || undefined,
      mediaUrls: selectedMediaList.length > 0 ? selectedMediaList : undefined,
      mediaType: selectedMediaList.length > 1 ? 'carousel' : selectedMediaList.length === 1 ? 'image' : 'none',
      location: location.trim() || undefined,
      hashtags,
      taggedUsers,
      audience,
      isCloseFriendsOnly: audience === 'close_friends',
      poll: showPollCreator && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            options: pollOptions.filter((o) => o.trim()).map((txt, idx) => ({
              id: `opt_${idx}`,
              text: txt.trim(),
              votes: 0,
            })),
            totalVotes: 0,
          }
        : undefined,
    };

    onSubmitPost(postData);
    setContent('');
    setSelectedMediaList([]);
    setTaggedUsers([]);
    setShowPollCreator(false);
    onClose();
  };

  const handleToggleSampleMedia = (url: string) => {
    if (selectedMediaList.includes(url)) {
      setSelectedMediaList(selectedMediaList.filter((u) => u !== url));
    } else {
      setSelectedMediaList([...selectedMediaList, url]);
    }
  };

  const handleAIEnhance = () => {
    onTriggerAIAssistant(content, (enhancedText) => {
      setContent(enhancedText);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#030B1E] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">VANDEYA Studio Composer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  {currentUser.displayName}
                  {currentUser.isVerified && <span className="text-emerald-400">✓</span>}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <select
                    value={audience}
                    onChange={(e: any) => setAudience(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                  >
                    <option value="public">🌍 Public (Bharat & World)</option>
                    <option value="followers">👥 Followers Only</option>
                    <option value="close_friends">⭐ Close Friends Only</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAIEnhance}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Polish</span>
            </button>
          </div>

          {/* Text Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('create_post_placeholder')}
            rows={4}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none resize-none"
          />

          {/* Selected Media Carousel Preview */}
          {selectedMediaList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Selected Media ({selectedMediaList.length} items — Carousel)</span>
                <button
                  type="button"
                  onClick={() => setSelectedMediaList([])}
                  className="text-rose-400 hover:text-rose-300 text-[11px]"
                >
                  Clear all
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {selectedMediaList.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setSelectedMediaList(selectedMediaList.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Media Picker Tray */}
          {showMediaPicker && (
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Select Multiple Photos for Carousel</span>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Done
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_MEDIA_LIBRARY.map((item, idx) => {
                  const isSelected = selectedMediaList.includes(item.url);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleSampleMedia(item.url)}
                      className={`group relative h-16 rounded-xl overflow-hidden cursor-pointer border transition-all ${
                        isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] text-white font-medium">{item.label}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-500 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tag People Input */}
          <div className="flex items-center gap-2 text-xs bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              value={taggedUserHandle}
              onChange={(e) => setTaggedUserHandle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (taggedUserHandle.trim()) {
                    setTaggedUsers([...taggedUsers, taggedUserHandle.trim().replace('@', '')]);
                    setTaggedUserHandle('');
                  }
                }
              }}
              placeholder="Tag citizens (e.g. priyasharma_ai)... Press enter"
              className="bg-transparent text-slate-200 focus:outline-none text-xs flex-1"
            />
          </div>

          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {taggedUsers.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center gap-1"
                >
                  <span>@{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTaggedUsers(taggedUsers.filter((_, i) => i !== idx))}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Location Bar */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Tag city/location in India..."
              className="bg-transparent text-slate-200 focus:outline-none text-xs flex-1"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMediaPicker(!showMediaPicker)}
              className="p-2 rounded-full hover:bg-slate-800 text-emerald-400 cursor-pointer"
              title="Add Image / Carousel"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowPollCreator(!showPollCreator)}
              className="p-2 rounded-full hover:bg-slate-800 text-sky-400 cursor-pointer"
              title="Create Poll"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!content.trim() && selectedMediaList.length === 0}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF6B08] via-amber-500 to-[#10B981] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('btn_publish')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
