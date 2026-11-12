import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  Bookmark,
  Plus,
  Music,
  Sliders,
  Send,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReelItem {
  id: string;
  creator: string;
  username: string;
  avatar: string;
  caption: string;
  audioTrack: string;
  mediaUrl: string;
  views: number;
  likes: number;
  comments: number;
  isSaved?: boolean;
}

const INITIAL_REELS: ReelItem[] = [
  {
    id: 'r1',
    creator: 'Priya Sharma 🇮🇳',
    username: 'priyasharma_ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
    caption: 'Running speech synthesis on Indic languages right inside edge devices! 🚀✨ #VandeyaTech #DeepTechIndia',
    audioTrack: 'Original Audio · AI in Bharat Corridor',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    views: 48200,
    likes: 12400,
    comments: 480,
  },
  {
    id: 'r2',
    creator: 'Arjun Verma 🏔️',
    username: 'arjun_nomad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    caption: 'Winter morning at Rohtang Pass. Pure silence and untouched snow. ❄️ #IncredibleIndia #Himalayas',
    audioTrack: 'Flute of the Valley · Traditional Sitar & Bansuri',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    views: 89400,
    likes: 28900,
    comments: 920,
  },
  {
    id: 'r3',
    creator: 'VANDEYA Official',
    username: 'vandeya',
    avatar: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=100',
    caption: 'Proudly Made in India. 1.4 Billion voices connected as one sovereign digital nation. 🇮🇳 #Vandeya',
    audioTrack: 'Vande Mataram · Symphonic Anthem',
    mediaUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    views: 182000,
    likes: 54100,
    comments: 2410,
  },
];

const BHARAT_SOUNDTRACKS = [
  'Vande Mataram · Symphonic Anthem',
  'Flute of the Valley · Bansuri Beats',
  'Bengaluru Tech Pulse · Synthwave',
  'Varanasi Temple Bells · Ambient',
  'Punjab Dhol Rhythm · High Energy',
];

interface VandeyaShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VandeyaShortsModal: React.FC<VandeyaShortsModalProps> = ({ isOpen, onClose }) => {
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // Reel creator form state
  const [newCaption, setNewCaption] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(BHARAT_SOUNDTRACKS[0]);
  const [selectedSpeed, setSelectedSpeed] = useState<'0.5x' | '1x' | '1.5x' | '2x'>('1x');
  const [selectedFilter, setSelectedFilter] = useState('Golden Sunset');

  if (!isOpen) return null;

  const currentReel = reels[currentIndex];

  const handleLike = (id: string) => {
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!isLiked[id]) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF6B08', '#FFFFFF', '#10B981'],
      });
    }
  };

  const handleSaveToggle = (id: string) => {
    setIsSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePublishReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const createdReel: ReelItem = {
      id: `r_${Date.now()}`,
      creator: 'You (Citizen)',
      username: 'you_official',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      caption: newCaption.trim(),
      audioTrack: selectedMusic,
      mediaUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
      views: 1,
      likes: 1,
      comments: 0,
    };

    setReels([createdReel, ...reels]);
    setCurrentIndex(0);
    setShowCreator(false);
    setNewCaption('');
    confetti({ particleCount: 30, spread: 55, colors: ['#FF6B08', '#FFFFFF', '#10B981'] });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-sm h-full sm:h-[88vh] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-black tracking-wide">VANDEYA REELS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreator(!showCreator)}
              className="p-1.5 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
              title="Create Reel"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Reel Studio Creator Drawer */}
        {showCreator ? (
          <div className="relative z-30 h-full bg-slate-950/95 p-5 flex flex-col justify-between text-white overflow-y-auto">
            <div className="pt-12 space-y-4">
              <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Create Vandeya Reel
              </h3>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Choose Licensed Indian Audio
                </label>
                <select
                  value={selectedMusic}
                  onChange={(e) => setSelectedMusic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  {BHARAT_SOUNDTRACKS.map((track) => (
                    <option key={track} value={track}>
                      🎵 {track}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Video Speed
                </label>
                <div className="flex gap-2">
                  {['0.5x', '1x', '1.5x', '2x'].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setSelectedSpeed(spd as any)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                        selectedSpeed === spd
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Caption & #Hashtags
                </label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Tell your story... #VandeyaReels #Bharat"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishReel}
                disabled={!newCaption.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs disabled:opacity-40"
              >
                Publish Reel
              </button>
            </div>
          </div>
        ) : (
          /* Normal Reel Viewer Layer */
          <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <img
              src={currentReel.mediaUrl}
              alt=""
              className="w-full h-full object-cover select-none"
            />

            {/* Right Floating Actions */}
            <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
              <button
                onClick={() => handleLike(currentReel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`p-3 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110 ${
                    isLiked[currentReel.id] ? 'text-rose-500' : 'text-white'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked[currentReel.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </div>
                <span className="text-[11px] font-bold mt-1">
                  {(currentReel.likes + (isLiked[currentReel.id] ? 1 : 0)).toLocaleString()}
                </span>
              </button>

              <button className="flex flex-col items-center group cursor-pointer">
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold mt-1">{currentReel.comments}</span>
              </button>

              <button
                onClick={() => handleSaveToggle(currentReel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110">
                  <Bookmark
                    className={`w-6 h-6 ${isSaved[currentReel.id] ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </div>
                <span className="text-[11px] font-bold mt-1">Save</span>
              </button>

              <button className="flex flex-col items-center group cursor-pointer">
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold mt-1">Share</span>
              </button>
            </div>

            {/* Bottom Caption, Views & Creator Info */}
            <div className="absolute bottom-0 left-0 right-16 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={currentReel.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <p className="text-xs font-bold flex items-center gap-1">
                    {currentReel.creator}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
                  </p>
                  <p className="text-[10px] text-slate-300">@{currentReel.username}</p>
                </div>
              </div>

              <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed">
                {currentReel.caption}
              </p>

              <div className="flex items-center gap-3 text-[10px] text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Eye className="w-3 h-3" /> {currentReel.views.toLocaleString()} views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300 truncate max-w-[140px]">
                  <Music className="w-3 h-3" /> {currentReel.audioTrack}
                </span>
              </div>
            </div>

            {/* Up / Down Navigation Controls */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              )}
              {currentIndex < reels.length - 1 && (
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
