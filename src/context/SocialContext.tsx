import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  FollowRequest, 
  BlockRecord, 
  ChatLock, 
  ReportRecord, 
  UserNote, 
  AdminAuditLog 
} from '../types';
import { useAuth } from './AuthContext';
import { SEED_USERS, SEED_NOTES, SEED_REPORTS, SEED_AUDIT_LOGS } from '../data/seedData';

// Secure SHA-256 PIN Hashing using native Web Crypto API
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`vandeya_salt_${pin}_secure_vault`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface SocialContextType {
  // Follow / Unfollow & Requests
  followingMap: Record<string, boolean>;
  followRequests: FollowRequest[];
  followUser: (targetUser: UserProfile) => void;
  unfollowUser: (targetUserId: string) => void;
  acceptFollowRequest: (requestId: string) => void;
  rejectFollowRequest: (requestId: string) => void;
  isFollowing: (targetUserId: string) => boolean;
  isRequested: (targetUserId: string) => boolean;

  // Block & Unblock System
  blockedUsers: BlockRecord[];
  blockUser: (targetUserId: string) => void;
  unblockUser: (targetUserId: string) => void;
  isUserBlockedByMe: (targetUserId: string) => boolean;
  isUserBlockingMe: (targetUserId: string) => boolean;
  isAnyBlockActive: (userA: string, userB: string) => boolean;

  // Private Chat Lock System
  chatLocks: Record<string, ChatLock>;
  unlockedChatIds: Record<string, boolean>;
  lockChat: (convId: string, rawPin: string) => Promise<void>;
  unlockChat: (convId: string, rawPin: string) => Promise<boolean>;
  relockChat: (convId: string) => void;
  isChatLocked: (convId: string) => boolean;
  isChatUnlocked: (convId: string) => boolean;

  // Instagram Notes
  userNotes: UserNote[];
  addOrUpdateNote: (text: string) => void;

  // Close Friends List
  closeFriends: string[];
  toggleCloseFriend: (userId: string) => void;
  isCloseFriend: (userId: string) => boolean;

  // Reports & Moderation
  reports: ReportRecord[];
  submitReport: (targetUserId: string, reportedUserName: string, category: any, description: string, reportedPostId?: string) => void;
  updateReportStatus: (reportId: string, status: any, decision?: string, internalNotes?: string, actionTaken?: any) => void;
  adminAuditLogs: AdminAuditLog[];
  logAdminAction: (actionType: string, targetUserId: string, details: string) => void;

  // User Suspension Management
  suspendedUsersMap: Record<string, { reason: string; until: string }>;
  suspendUser: (targetUserId: string, reason: string, duration: '24h' | '7d' | '30d' | 'permanent') => void;
  restoreUser: (targetUserId: string) => void;
  isUserSuspended: (userId: string) => boolean;

  // All known platform users (seed + dynamically registered)
  allUsers: UserProfile[];
  findUserByIdOrHandle: (query: string) => UserProfile | undefined;
}

const SocialContext = createContext<SocialContextType | null>(null);

export const SocialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  // Following mapping: targetUserId -> true
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    priya_tech: true,
  });

  // Pending follow requests for private accounts
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([
    {
      id: 'req_1',
      fromUserId: 'rohit_cricket',
      toUserId: 'vandeya_creator_guest',
      fromUserName: 'Rohit Kulkarni 🏏',
      fromUserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      fromUsername: 'rohit_cricketpulse',
      createdAt: '1h ago',
    },
  ]);

  // Outgoing requested follow state
  const [requestedMap, setRequestedMap] = useState<Record<string, boolean>>({
    rohit_cricket: false,
  });

  // Block records: [{ blockerId, blockedId, ... }]
  const [blockedUsers, setBlockedUsers] = useState<BlockRecord[]>([]);

  // Chat locks: convId -> ChatLock
  const [chatLocks, setChatLocks] = useState<Record<string, ChatLock>>({});
  // Unlocked in current session
  const [unlockedChatIds, setUnlockedChatIds] = useState<Record<string, boolean>>({});

  // Notes
  const [userNotes, setUserNotes] = useState<UserNote[]>(SEED_NOTES);

  // Close friends userIds
  const [closeFriends, setCloseFriends] = useState<string[]>(['priya_tech']);

  // Reports
  const [reports, setReports] = useState<ReportRecord[]>(SEED_REPORTS);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(SEED_AUDIT_LOGS);

  // Suspended users
  const [suspendedUsersMap, setSuspendedUsersMap] = useState<Record<string, { reason: string; until: string }>>({});

  // All known platform users
  const [allUsers, setAllUsers] = useState<UserProfile[]>(SEED_USERS);

  // ------------------------------------
  // Follow / Unfollow System
  // ------------------------------------
  const followUser = (targetUser: UserProfile) => {
    if (!currentUser) return;

    if (targetUser.isPrivate) {
      // Send Follow Request
      setRequestedMap((prev) => ({ ...prev, [targetUser.uid]: true }));
      const newReq: FollowRequest = {
        id: `req_${Date.now()}`,
        fromUserId: currentUser.uid,
        toUserId: targetUser.uid,
        fromUserName: currentUser.displayName,
        fromUserAvatar: currentUser.photoURL,
        fromUsername: currentUser.username,
        createdAt: 'Just now',
      };
      setFollowRequests((prev) => [...prev, newReq]);
    } else {
      // Follow directly
      setFollowingMap((prev) => ({ ...prev, [targetUser.uid]: true }));
      setRequestedMap((prev) => ({ ...prev, [targetUser.uid]: false }));
    }
  };

  const unfollowUser = (targetUserId: string) => {
    setFollowingMap((prev) => {
      const copy = { ...prev };
      delete copy[targetUserId];
      return copy;
    });
    setRequestedMap((prev) => {
      const copy = { ...prev };
      delete copy[targetUserId];
      return copy;
    });
  };

  const acceptFollowRequest = (requestId: string) => {
    const req = followRequests.find((r) => r.id === requestId);
    if (req) {
      setFollowRequests((prev) => prev.filter((r) => r.id !== requestId));
      setFollowingMap((prev) => ({ ...prev, [req.fromUserId]: true }));
    }
  };

  const rejectFollowRequest = (requestId: string) => {
    setFollowRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const isFollowing = (targetUserId: string) => Boolean(followingMap[targetUserId]);
  const isRequested = (targetUserId: string) => Boolean(requestedMap[targetUserId]);

  // ------------------------------------
  // Block & Unblock System (Mandatory Rules 1-10)
  // ------------------------------------
  const blockUser = (targetUserId: string) => {
    if (!currentUser) return;

    // 1. Sever existing follow relationships in both directions
    unfollowUser(targetUserId);

    // 2. Add block record
    const record: BlockRecord = {
      id: `blk_${Date.now()}`,
      blockerId: currentUser.uid,
      blockedId: targetUserId,
      createdAt: new Date().toISOString(),
    };
    setBlockedUsers((prev) => [...prev, record]);

    // 3. Log security action
    logAdminAction('USER_BLOCK', targetUserId, `User ${currentUser.displayName} blocked ${targetUserId}`);
  };

  const unblockUser = (targetUserId: string) => {
    if (!currentUser) return;
    setBlockedUsers((prev) =>
      prev.filter(
        (b) => !(b.blockerId === currentUser.uid && b.blockedId === targetUserId)
      )
    );
    // Note: Historical chat is restored, but follow is NOT automatically re-added (per Rule 8)
  };

  const isUserBlockedByMe = (targetUserId: string) => {
    if (!currentUser) return false;
    return blockedUsers.some(
      (b) => b.blockerId === currentUser.uid && b.blockedId === targetUserId
    );
  };

  const isUserBlockingMe = (targetUserId: string) => {
    if (!currentUser) return false;
    return blockedUsers.some(
      (b) => b.blockerId === targetUserId && b.blockedId === currentUser.uid
    );
  };

  const isAnyBlockActive = (userA: string, userB: string) => {
    return blockedUsers.some(
      (b) =>
        (b.blockerId === userA && b.blockedId === userB) ||
        (b.blockerId === userB && b.blockedId === userA)
    );
  };

  // ------------------------------------
  // Private Chat Lock System (SHA-256 Hashed)
  // ------------------------------------
  const lockChat = async (convId: string, rawPin: string) => {
    const hashed = await hashPin(rawPin);
    const lockRecord: ChatLock = {
      conversationId: convId,
      hashedPin: hashed,
      isLocked: true,
      lockedAt: new Date().toISOString(),
    };
    setChatLocks((prev) => ({ ...prev, [convId]: lockRecord }));
    setUnlockedChatIds((prev) => {
      const copy = { ...prev };
      delete copy[convId];
      return copy;
    });
  };

  const unlockChat = async (convId: string, rawPin: string): Promise<boolean> => {
    const lock = chatLocks[convId];
    if (!lock) return true;
    const testHash = await hashPin(rawPin);
    if (testHash === lock.hashedPin) {
      setUnlockedChatIds((prev) => ({ ...prev, [convId]: true }));
      return true;
    }
    return false;
  };

  const relockChat = (convId: string) => {
    setUnlockedChatIds((prev) => {
      const copy = { ...prev };
      delete copy[convId];
      return copy;
    });
  };

  const isChatLocked = (convId: string) => Boolean(chatLocks[convId]?.isLocked);
  const isChatUnlocked = (convId: string) => Boolean(unlockedChatIds[convId]);

  // ------------------------------------
  // Instagram Notes
  // ------------------------------------
  const addOrUpdateNote = (text: string) => {
    if (!currentUser) return;
    const existingIndex = userNotes.findIndex((n) => n.userId === currentUser.uid);
    const updatedNote: UserNote = {
      id: `note_${Date.now()}`,
      userId: currentUser.uid,
      userName: currentUser.displayName.split(' ')[0],
      userAvatar: currentUser.photoURL,
      text: text.slice(0, 60),
      createdAt: 'Just now',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    if (existingIndex >= 0) {
      const updated = [...userNotes];
      updated[existingIndex] = updatedNote;
      setUserNotes(updated);
    } else {
      setUserNotes([updatedNote, ...userNotes]);
    }
  };

  // ------------------------------------
  // Close Friends
  // ------------------------------------
  const toggleCloseFriend = (userId: string) => {
    setCloseFriends((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  const isCloseFriend = (userId: string) => closeFriends.includes(userId);

  // ------------------------------------
  // Reports & Super Admin Moderation
  // ------------------------------------
  const submitReport = (
    targetUserId: string,
    reportedUserName: string,
    category: any,
    description: string,
    reportedPostId?: string
  ) => {
    if (!currentUser) return;
    const newReport: ReportRecord = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.uid,
      reporterName: currentUser.displayName,
      reportedUserId: targetUserId,
      reportedUserName,
      reportedPostId,
      category,
      description,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    logAdminAction('REPORT_SUBMITTED', targetUserId, `Category: ${category}. Description: ${description.slice(0, 50)}`);
  };

  const updateReportStatus = (
    reportId: string,
    status: any,
    decision?: string,
    internalNotes?: string,
    actionTaken?: any
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            decision: decision || r.decision,
            adminNotes: internalNotes || r.adminNotes,
            actionTaken: actionTaken || r.actionTaken,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const logAdminAction = (actionType: string, targetUserId: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: currentUser?.email || 'system_guard@vandeya.in',
      actionType,
      targetUserId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAdminAuditLogs((prev) => [newLog, ...prev]);
  };

  // ------------------------------------
  // User Suspension Management
  // ------------------------------------
  const suspendUser = (
    targetUserId: string,
    reason: string,
    duration: '24h' | '7d' | '30d' | 'permanent'
  ) => {
    let until = 'permanent';
    const now = Date.now();
    if (duration === '24h') until = new Date(now + 24 * 3600 * 1000).toISOString();
    if (duration === '7d') until = new Date(now + 7 * 24 * 3600 * 1000).toISOString();
    if (duration === '30d') until = new Date(now + 30 * 24 * 3600 * 1000).toISOString();

    setSuspendedUsersMap((prev) => ({
      ...prev,
      [targetUserId]: { reason, until },
    }));

    logAdminAction('USER_SUSPENDED', targetUserId, `Suspended for ${duration}. Reason: ${reason}`);
  };

  const restoreUser = (targetUserId: string) => {
    setSuspendedUsersMap((prev) => {
      const copy = { ...prev };
      delete copy[targetUserId];
      return copy;
    });
    logAdminAction('USER_RESTORED', targetUserId, 'Account suspension lifted by Super Admin');
  };

  const isUserSuspended = (userId: string) => {
    const entry = suspendedUsersMap[userId];
    if (!entry) return false;
    if (entry.until === 'permanent') return true;
    return new Date(entry.until) > new Date();
  };

  const findUserByIdOrHandle = (query: string): UserProfile | undefined => {
    const q = query.trim().toLowerCase();
    return allUsers.find(
      (u) =>
        u.vandeyaId.toLowerCase() === q ||
        u.username.toLowerCase() === q ||
        u.displayName.toLowerCase().includes(q)
    );
  };

  return (
    <SocialContext.Provider
      value={{
        followingMap,
        followRequests,
        followUser,
        unfollowUser,
        acceptFollowRequest,
        rejectFollowRequest,
        isFollowing,
        isRequested,
        blockedUsers,
        blockUser,
        unblockUser,
        isUserBlockedByMe,
        isUserBlockingMe,
        isAnyBlockActive,
        chatLocks,
        unlockedChatIds,
        lockChat,
        unlockChat,
        relockChat,
        isChatLocked,
        isChatUnlocked,
        userNotes,
        addOrUpdateNote,
        closeFriends,
        toggleCloseFriend,
        isCloseFriend,
        reports,
        submitReport,
        updateReportStatus,
        adminAuditLogs,
        logAdminAction,
        suspendedUsersMap,
        suspendUser,
        restoreUser,
        isUserSuspended,
        allUsers,
        findUserByIdOrHandle,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
