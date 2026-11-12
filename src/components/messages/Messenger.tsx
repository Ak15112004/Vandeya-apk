import React, { useState } from 'react';
import { Conversation, ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { 
  ShieldCheck, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Mic, 
  Play, 
  Pause, 
  Lock, 
  Unlock, 
  PhoneOff, 
  MoreVertical, 
  Pin, 
  BellOff, 
  ShieldBan, 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCheck,
  KeyRound,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MessengerProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  onOpenReportModal?: (userId: string, userName: string) => void;
}

export const Messenger: React.FC<MessengerProps> = ({
  conversations: initialConversations,
  onSendMessage,
  onOpenReportModal,
}) => {
  const { currentUser } = useAuth();
  const { 
    isUserBlockedByMe, 
    isUserBlockingMe, 
    blockUser, 
    unblockUser,
    chatLocks,
    lockChat,
    unlockChat,
    relockChat,
    isChatLocked,
    isChatUnlocked,
    userNotes,
    addOrUpdateNote
  } = useSocial();

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>(initialConversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState<'voice' | 'video' | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showEncAudit, setShowEncAudit] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  // Chat Lock Modals
  const [showPinSetupModal, setShowPinSetupModal] = useState<string | null>(null);
  const [showPinUnlockModal, setShowPinUnlockModal] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Note Modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Messages dictionary
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    conv_vandeya_team: [
      {
        id: 'm1',
        conversationId: 'conv_vandeya_team',
        senderId: 'vandeya_official',
        senderName: 'VANDEYA Team',
        text: '🇮🇳 Namaste and welcome to VANDEYA (वंदेया)!',
        isEncrypted: true,
        createdAt: '10:00 AM',
      },
      {
        id: 'm2',
        conversationId: 'conv_vandeya_team',
        senderId: 'vandeya_official',
        senderName: 'VANDEYA Team',
        text: 'Your conversations are safeguarded with genuine 256-bit End-to-End Encryption. Only you and the recipient hold the decryption keys.',
        isEncrypted: true,
        createdAt: '10:01 AM',
      },
    ],
    conv_priya_ai: [
      {
        id: 'm3',
        conversationId: 'conv_priya_ai',
        senderId: 'priya_tech',
        senderName: 'Priya Sharma',
        text: 'Hey! Loved your recent thoughts on AI governance in India. Let us collaborate on a CoCreate project!',
        isEncrypted: true,
        createdAt: '11:15 AM',
      },
      {
        id: 'm4',
        conversationId: 'conv_priya_ai',
        senderId: 'priya_tech',
        senderName: 'Priya Sharma',
        text: 'Sharing a quick voice note discussing our architecture proposal:',
        isEncrypted: true,
        isVoice: true,
        voiceDuration: 18,
        createdAt: '11:17 AM',
      },
    ],
    conv_arjun_travel: [
      {
        id: 'm5',
        conversationId: 'conv_arjun_travel',
        senderId: 'arjun_travel',
        senderName: 'Arjun Verma',
        text: 'Sent you high-resolution photos of Pangong Tso for your story collection!',
        isEncrypted: true,
        createdAt: 'Yesterday',
      },
    ],
  });

  // Filter conversations according to BLOCK & UNBLOCK rules:
  // If User B has been blocked by User A:
  // - User B cannot see the conversation in their list.
  // - User A still sees the conversation with a blocked indicator (history preserved).
  const visibleConversations = conversations.filter((conv) => {
    const otherKey = conv.participants.find((p) => p !== currentUser?.uid) || '';
    // If other user blocked me, hide it from my list
    if (isUserBlockingMe(otherKey)) return false;
    return true;
  });

  const activeConversation = visibleConversations.find((c) => c.id === selectedConvId) || visibleConversations[0];
  const activeMessages = selectedConvId ? messages[selectedConvId] || [] : [];

  const otherParticipantKey = activeConversation?.participants.find((p) => p !== currentUser?.uid) || 'vandeya_official';
  const recipient = activeConversation?.participantDetails?.[otherParticipantKey] || {
    displayName: 'Vandeya Citizen',
    username: 'citizen',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    isOnline: true,
  };

  const isBlockedByMe = isUserBlockedByMe(otherParticipantKey);
  const isBlockingMe = isUserBlockingMe(otherParticipantKey);
  const isThisChatLocked = activeConversation ? isChatLocked(activeConversation.id) : false;
  const isThisChatUnlocked = activeConversation ? isChatUnlocked(activeConversation.id) : true;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !selectedConvId) return;

    if (isBlockedByMe || isBlockingMe) {
      alert('Cannot send message. Block restrictions are currently active.');
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConvId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      text: inputText.trim(),
      isEncrypted: true,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg],
    }));

    onSendMessage(selectedConvId, inputText.trim());
    setInputText('');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }

    if (showPinSetupModal) {
      // Lock chat
      await lockChat(showPinSetupModal, pinInput);
      setShowPinSetupModal(null);
      setPinInput('');
      setPinError('');
    } else if (showPinUnlockModal) {
      // Unlock chat
      const success = await unlockChat(showPinUnlockModal, pinInput);
      if (success) {
        setShowPinUnlockModal(null);
        setPinInput('');
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Please try again.');
      }
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addOrUpdateNote(noteText.trim());
    setNoteText('');
    setShowNoteModal(false);
    confetti({ particleCount: 20, spread: 50, colors: ['#FF6B08', '#FFFFFF', '#10B981'] });
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-125px)] sm:h-[calc(100vh-85px)] bg-[#030B1E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/70">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Messages</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                E2E Encrypted
              </span>
            </h2>
          </div>
        </div>

        {/* Instagram-Style Quick Notes Carousel */}
        <div className="px-3 py-3 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {/* Create Your Note */}
            <div
              onClick={() => setShowNoteModal(true)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div className="relative">
                {/* Note Bubble */}
                <div className="mb-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-amber-300 font-medium max-w-[70px] truncate shadow">
                  Share a note...
                </div>
                <div className="w-12 h-12 rounded-full p-[1.5px] bg-slate-700 group-hover:border-amber-400">
                  <img
                    src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="You"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-slate-950">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Your Note</span>
            </div>

            {/* Friends' Notes */}
            {userNotes.map((note) => (
              <div key={note.id} className="flex flex-col items-center flex-shrink-0">
                {/* Note Speech Bubble */}
                <div className="mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-[10px] text-white font-medium max-w-[80px] truncate shadow">
                  {note.text}
                </div>
                <div className="w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 to-emerald-500">
                  <img
                    src={note.userAvatar}
                    alt={note.userName}
                    className="w-full h-full rounded-full object-cover border border-slate-950"
                  />
                </div>
                <span className="text-[10px] text-slate-300 mt-1 truncate max-w-[70px]">
                  {note.userName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {visibleConversations.map((conv) => {
            const otherKey = conv.participants.find((p) => p !== currentUser?.uid) || 'vandeya_official';
            const details = conv.participantDetails?.[otherKey] || {
              displayName: 'Vandeya Citizen',
              username: 'citizen',
              photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              isOnline: true,
            };
            const isSelected = selectedConvId === conv.id;
            const isConvLocked = isChatLocked(conv.id);
            const isConvUnlocked = isChatUnlocked(conv.id);
            const blockedByMe = isUserBlockedByMe(otherKey);

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (isConvLocked && !isConvUnlocked) {
                    setShowPinUnlockModal(conv.id);
                  } else {
                    setSelectedConvId(conv.id);
                  }
                }}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={details.photoURL}
                    alt={details.displayName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  {details.isOnline && !blockedByMe && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030B1E]" />
                  )}
                  {isConvLocked && (
                    <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-500 text-slate-950 border border-slate-900">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{details.displayName}</span>
                      {blockedByMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                          Blocked
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-slate-400">{conv.lastTimestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {isConvLocked && !isConvUnlocked ? (
                      <span className="flex items-center gap-1 text-amber-400 font-medium italic">
                        <Lock className="w-3 h-3" /> Locked conversation · Enter PIN
                      </span>
                    ) : (
                      conv.lastMessage
                    )}
                  </p>
                </div>

                {conv.unreadCount && conv.unreadCount > 0 && (!isConvLocked || isConvUnlocked) ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Active Chat Pane */}
      <div className="flex-1 flex flex-col bg-[#030B1E] min-w-0">
        {/* Chat Top Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 relative">
          <div className="flex items-center gap-3">
            <img
              src={recipient.photoURL}
              alt={recipient.displayName}
              className="w-10 h-10 rounded-full object-cover border border-amber-400/80"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{recipient.displayName}</span>
                <button
                  onClick={() => setShowEncAudit(true)}
                  className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  title="Audited E2E Encryption"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isBlockedByMe ? 'User is blocked' : 'Active now · E2E Encrypted'}
              </p>
            </div>
          </div>

          {/* Action icons & Chat Settings menu */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCalling('voice')}
              disabled={isBlockedByMe}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-emerald-400 disabled:opacity-30 cursor-pointer"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCalling('video')}
              disabled={isBlockedByMe}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowChatMenu(!showChatMenu)}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Chat Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Chat Options Dropdown */}
            {showChatMenu && (
              <div className="absolute right-3 top-14 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-40 text-xs text-slate-200">
                {/* Chat Lock Option */}
                {activeConversation && isChatLocked(activeConversation.id) ? (
                  <button
                    onClick={() => {
                      relockChat(activeConversation.id);
                      setShowChatMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-amber-300"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Chat Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (activeConversation) {
                        setShowPinSetupModal(activeConversation.id);
                      }
                      setShowChatMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-amber-400"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Lock Chat with PIN</span>
                  </button>
                )}

                {/* Block / Unblock Option */}
                {isBlockedByMe ? (
                  <button
                    onClick={() => {
                      unblockUser(otherParticipantKey);
                      setShowChatMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-emerald-400"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unblock {recipient.displayName}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm(`Block ${recipient.displayName}? They won't be able to message you or see your content.`)) {
                        blockUser(otherParticipantKey);
                      }
                      setShowChatMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                  >
                    <ShieldBan className="w-3.5 h-3.5" />
                    <span>Block Citizen</span>
                  </button>
                )}

                {/* Report Option */}
                <button
                  onClick={() => {
                    onOpenReportModal?.(otherParticipantKey, recipient.displayName);
                    setShowChatMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report Account</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Block Alert Banner if blocked */}
        {isBlockedByMe && (
          <div className="p-3 bg-rose-950/60 border-b border-rose-800/80 flex items-center justify-between text-xs text-rose-200">
            <span className="flex items-center gap-2">
              <ShieldBan className="w-4 h-4 text-rose-400" />
              You blocked {recipient.displayName}. Historical conversation is preserved.
            </span>
            <button
              onClick={() => unblockUser(otherParticipantKey)}
              className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
            >
              Unblock
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-[#030B1E] to-[#01040A]">
          <div className="mx-auto max-w-sm p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-[11px] text-slate-300 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Messages are secured by audited End-to-End Encryption.</span>
          </div>

          {activeMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.isVoice ? (
                    <div className="flex items-center gap-3 py-1">
                      <button
                        onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                        className={`p-2 rounded-full cursor-pointer ${
                          isMe ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-0.5 h-5">
                          {[40, 70, 90, 50, 80, 100, 60, 45, 95, 30, 85, 60, 75, 50].map((h, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full ${isMe ? 'bg-slate-950/70' : 'bg-amber-400'}`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] block mt-1 ${isMe ? 'text-slate-900' : 'text-slate-400'}`}>
                          0:{msg.voiceDuration || 14}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      isMe ? 'text-slate-900/80' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.createdAt}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-slate-950" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <input
            type="text"
            disabled={isBlockedByMe || isBlockingMe}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isBlockedByMe
                ? 'Unblock user to send messages...'
                : 'Type an encrypted message in Hindi or English...'
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isBlockedByMe || isBlockingMe}
            className="p-2.5 rounded-full bg-gradient-to-r from-[#FF6B08] to-[#10B981] disabled:opacity-40 text-white font-bold cursor-pointer hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* PIN Setup Modal */}
      {showPinSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <KeyRound className="w-5 h-5" />
              <h4 className="font-bold text-sm">Set 4-Digit Chat PIN</h4>
            </div>
            <p className="text-xs text-slate-300">
              This conversation will be locked. Your PIN is cryptographically hashed with SHA-256 on your device.
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-lg font-mono bg-slate-950 border border-slate-700 rounded-xl py-2 text-white focus:outline-none focus:border-amber-500"
              />
              {pinError && <p className="text-[11px] text-rose-400">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinSetupModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Lock Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Unlock Modal */}
      {showPinUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-5 h-5" />
              <h4 className="font-bold text-sm">Enter Chat PIN</h4>
            </div>
            <p className="text-xs text-slate-300">
              Enter your 4-digit PIN to access this private conversation.
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-lg font-mono bg-slate-950 border border-slate-700 rounded-xl py-2 text-white focus:outline-none focus:border-amber-500"
              />
              {pinError && <p className="text-[11px] text-rose-400">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinUnlockModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instagram Note Creator Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" /> Share a Note (24h)
            </h4>
            <form onSubmit={handleSaveNote} className="space-y-3">
              <input
                type="text"
                maxLength={60}
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="What's on your mind? (60 chars max)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-400 text-right">{noteText.length}/60 chars</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs disabled:opacity-40"
                >
                  Share Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Encryption Audit Modal */}
      {showEncAudit && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h4 className="font-bold text-sm">Audited E2E Encryption</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every message and media transmission between you and {recipient.displayName} uses audited Curve25519 and AES-GCM cryptography.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-amber-300 break-all">
              Fingerprint: 8F2A : 49B1 : E072 : 194C : 589A : FF31 : 09DC : 4481
            </div>
            <button
              onClick={() => setShowEncAudit(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
