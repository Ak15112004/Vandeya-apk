import React, { useState } from 'react';
import { Post, Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Globe2, 
  Users, 
  Lock,
  ChevronLeft,
  ChevronRight,
  Archive,
  Trash2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReportPost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeToggle,
  onAddComment,
  onVotePoll,
  onReportPost,
  onDeletePost,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: `c_${post.id}_1`,
      postId: post.id,
      authorId: 'priya_tech',
      authorName: 'Priya Sharma 🇮🇳',
      authorPhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      authorVerified: true,
      text: 'Proud to see this! Connecting India with true digital self-reliance. Jai Hind! 🇮🇳',
      createdAt: '1h ago',
    },
  ]);
  const [isLiked, setIsLiked] = useState(Boolean(post.likedByCurrentUser));
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(Boolean(post.savedByCurrentUser));
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);
  const [isReposted, setIsReposted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Carousel index for multiple photos
  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : post.mediaUrl ? [post.mediaUrl] : [];
  const [carouselIndex, setCarouselIndex] = useState(0);

  const isAuthor = currentUser?.uid === post.authorId;
  const canManagePost = isAuthor || isAdmin;

  const handleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : prev - 1));
    onLikeToggle(post.id);

    if (nextState) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#FF6B08', '#FFFFFF', '#10B981'],
      });
    }
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostsCount((prev) => (isReposted ? prev - 1 : prev + 1));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const added: Comment = {
      id: `c_${Date.now()}`,
      postId: post.id,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorPhotoURL: currentUser.photoURL,
      authorVerified: currentUser.isVerified,
      text: newComment.trim(),
      createdAt: 'Just now',
    };

    setComments([added, ...comments]);
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const audienceIcons = {
    public: <span title="Public"><Globe2 className="w-3 h-3 text-slate-400" /></span>,
    followers: <span title="Followers only"><Users className="w-3 h-3 text-emerald-400" /></span>,
    close_friends: <span title="Close Friends"><Lock className="w-3 h-3 text-emerald-400" /></span>,
  };

  return (
    <article className="w-full bg-[#030B1E]/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all shadow-lg">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorPhotoURL}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-white">{post.authorName}</span>
              {post.authorVerified && (
                <span className="text-emerald-400" title="Bharat Verified">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
                </span>
              )}
              <span className="text-xs text-slate-400">@{post.authorUsername}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>{post.location}</span>
                </>
              )}
              <span>•</span>
              {audienceIcons[post.audience || 'public']}
              {post.audience === 'close_friends' && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9px]">
                  Close Friends
                </span>
              )}
            </div>
          </div>
        </div>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-30 text-xs">
              <button
                onClick={() => {
                  handleShare();
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Post Link</span>
              </button>

              {canManagePost && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeletePost?.(post.id);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowMenu(false);
                  onReportPost?.(post);
                }}
                className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report to Safety Guardian</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-100 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Interactive Poll if present */}
      {post.poll && (
        <div className="px-4 pb-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <p className="text-xs font-bold text-amber-300 mb-2.5">{post.poll.question}</p>
            <div className="space-y-2">
              {post.poll.options.map((opt) => {
                const total = post.poll?.totalVotes || 1;
                const percentage = Math.round((opt.votes / total) * 100);
                return (
                  <button
                    key={opt.id}
                    onClick={() => onVotePoll(post.id, opt.id)}
                    className="w-full relative overflow-hidden rounded-lg border border-slate-700/70 p-2.5 text-left transition-all hover:border-amber-500/50 cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{opt.text}</span>
                      <span className="font-bold text-amber-400">{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">
              {post.poll.totalVotes.toLocaleString()} votes · Powered by Vandeya
            </p>
          </div>
        </div>
      )}

      {/* Media Carousel / Single Image */}
      {mediaList.length > 0 && (
        <div className="relative w-full max-h-[480px] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={mediaList[carouselIndex]}
            alt="Post content"
            className="w-full h-auto max-h-[480px] object-cover transition-all duration-300"
            loading="lazy"
          />

          {/* Carousel Next/Prev Controls */}
          {mediaList.length > 1 && (
            <>
              {carouselIndex > 0 && (
                <button
                  onClick={() => setCarouselIndex(carouselIndex - 1)}
                  className="absolute left-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {carouselIndex < mediaList.length - 1 && (
                <button
                  onClick={() => setCarouselIndex(carouselIndex + 1)}
                  className="absolute right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Carousel Dot Indicators */}
              <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                {mediaList.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      carouselIndex === i ? 'w-4 bg-amber-400' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Interaction Metrics Bar */}
      <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
            isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform group-hover:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{likesCount.toLocaleString()}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer group"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-125 transition-transform" />
          <span>{comments.length + post.commentsCount}</span>
        </button>

        <button
          onClick={handleRepost}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
            isReposted ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
          }`}
        >
          <Repeat2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
          <span>{repostsCount}</span>
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            isSaved ? 'text-amber-400' : 'hover:text-amber-400'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="p-1 hover:text-white transition-colors cursor-pointer relative"
          title="Share post"
        >
          <Share2 className="w-4 h-4" />
          {copiedLink && (
            <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 space-y-3">
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <img
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.displayName}
              className="w-7 h-7 rounded-full object-cover border border-amber-500"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share a respectful response..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-full px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-1.5 rounded-full bg-amber-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-xs">
                <img
                  src={c.authorPhotoURL}
                  alt={c.authorName}
                  className="w-6 h-6 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1">
                      {c.authorName}
                      {c.authorVerified && <span className="text-emerald-400 text-[10px]">✓</span>}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
