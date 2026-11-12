export type UserRole = 'user' | 'creator' | 'admin';

export interface UserProfile {
  uid: string;
  vandeyaId: string; // Unique alphanumeric VANDEYA ID e.g. "VD-849201"
  email: string;
  displayName: string;
  username: string;
  bio: string;
  photoURL: string;
  bannerURL: string;
  isVerified: boolean;
  isPrivate: boolean; // Private account: requires follow request approval
  role: UserRole;
  language: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  badges?: string[];
  isSuspended?: boolean;
  suspensionReason?: string;
  suspensionUntil?: string; // ISO date string or 'permanent'
  createdAt: string;
  updatedAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string;
  authorVerified?: boolean;
  content: string;
  mediaUrl?: string; // Primary media
  mediaUrls?: string[]; // Multiple photos carousel
  mediaType?: 'image' | 'video' | 'carousel' | 'none';
  location?: string;
  hashtags?: string[];
  taggedUsers?: string[];
  audience: 'public' | 'followers' | 'close_friends';
  isCloseFriendsOnly?: boolean;
  isArchived?: boolean;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
  };
  likedByCurrentUser?: boolean;
  savedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  authorVerified?: boolean;
  text: string;
  likesCount?: number;
  createdAt: string;
}

export interface StoryViewer {
  viewerId: string;
  viewerName: string;
  viewerAvatar: string;
  viewedAt: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  mediaUrl: string;
  caption?: string;
  isCloseFriendsOnly?: boolean;
  viewers?: StoryViewer[];
  createdAt: string;
  expiresAt: string;
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverUrl: string;
  stories: Story[];
  createdAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string; // 60-character quick Instagram-style note
  createdAt: string;
  expiresAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  text: string;
  mediaUrl?: string;
  voiceDuration?: number;
  isVoice?: boolean;
  isEncrypted: boolean;
  reactions?: Record<string, string[]>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, {
    displayName: string;
    username: string;
    photoURL: string;
    isOnline?: boolean;
  }>;
  lastMessage: string;
  lastSenderId: string;
  lastTimestamp: string;
  unreadCount?: number;
  isGroup?: boolean;
  groupName?: string;
  isEncrypted: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  disappearingTimerHours?: number; // e.g. 24, 48, 0 for off
}

export interface ChatLock {
  conversationId: string;
  hashedPin: string; // Stored hashed with SHA-256
  isLocked: boolean;
  lockedAt: string;
}

export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUsername: string;
  createdAt: string;
}

export interface BlockRecord {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

export interface TimeCapsule {
  id: string;
  userId: string;
  title: string;
  content: string;
  mediaUrl?: string;
  unlockDate: string;
  isUnlocked: boolean;
  recipientEmail?: string;
  createdAt: string;
}

export type ReportCategory = 
  | 'fake_account'
  | 'harassment'
  | 'bullying'
  | 'threats'
  | 'spam'
  | 'scam'
  | 'inappropriate_content'
  | 'impersonation'
  | 'unwanted_messages'
  | 'copyright';

export type ReportStatus = 'Pending' | 'Under Review' | 'Action Taken' | 'Rejected' | 'Closed';

export interface ReportRecord {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedPostId?: string;
  category: ReportCategory;
  description: string;
  evidenceUrl?: string;
  status: ReportStatus;
  decision?: string;
  adminNotes?: string;
  actionTaken?: 'warned' | 'suspended_24h' | 'suspended_7d' | 'suspended_30d' | 'banned_permanent' | 'none';
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  actionType: string;
  targetUserId?: string;
  targetUserName?: string;
  reason?: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'follow_request' | 'request_accepted' | 'mention' | 'capsule' | 'system' | 'report_update';
  actorName: string;
  actorPhoto: string;
  content: string;
  targetId?: string;
  timestamp: string;
  isRead: boolean;
}
