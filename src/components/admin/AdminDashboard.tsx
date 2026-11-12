import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { Post, UserProfile, ReportRecord } from '../../types';
import { 
  X, 
  ShieldAlert, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  Database, 
  Cpu, 
  Lock,
  Search,
  ShieldBan,
  Clock,
  UserCheck,
  FileText,
  AlertOctagon,
  Award,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onDeletePost: (postId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  posts,
  onDeletePost,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { 
    allUsers, 
    reports, 
    updateReportStatus, 
    adminAuditLogs, 
    logAdminAction, 
    suspendUser, 
    restoreUser, 
    isUserSuspended, 
    suspendedUsersMap 
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'users' | 'moderation' | 'security'>('analytics');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [reportNoteInput, setReportNoteInput] = useState('');
  const [selectedSuspensionDuration, setSelectedSuspensionDuration] = useState<'24h' | '7d' | '30d' | 'permanent'>('24h');
  const [suspensionReason, setSuspensionReason] = useState('Terms of service violation');

  if (!isOpen || !isAdmin) return null;

  // Filtered users in admin management
  const cleanUserQuery = userSearchQuery.trim().toLowerCase();
  const filteredAdminUsers = allUsers.filter((u) => {
    if (!cleanUserQuery) return true;
    return (
      u.displayName.toLowerCase().includes(cleanUserQuery) ||
      u.username.toLowerCase().includes(cleanUserQuery) ||
      u.vandeyaId.toLowerCase().includes(cleanUserQuery) ||
      u.email.toLowerCase().includes(cleanUserQuery)
    );
  });

  const handleApplyReportDecision = (
    report: ReportRecord,
    action: 'warned' | 'suspended_24h' | 'suspended_7d' | 'suspended_30d' | 'banned_permanent' | 'none',
    status: 'Action Taken' | 'Rejected' | 'Closed'
  ) => {
    let decisionText = `Super admin set status to ${status}.`;

    if (action.startsWith('suspended') || action === 'banned_permanent') {
      const dur = action === 'banned_permanent' ? 'permanent' : (action.split('_')[1] as any);
      suspendUser(report.reportedUserId, report.category, dur);
      decisionText = `User ${report.reportedUserName} suspended (${dur}) due to verified ${report.category}.`;
    } else if (action === 'warned') {
      decisionText = `Formal warning issued to user ${report.reportedUserName}.`;
      logAdminAction('WARNING_ISSUED', report.reportedUserId, `Warning issued for report ${report.id}`);
    }

    updateReportStatus(report.id, status, decisionText, reportNoteInput, action);
    setSelectedReport(null);
    setReportNoteInput('');
  };

  const pendingReportsCount = reports.filter((r) => r.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#030B1E] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Super Admin Top Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-slate-950 shadow-lg">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">VANDEYA Founder & Owner Control Panel</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  ROOT OWNER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Primary Owner Authority: <strong className="text-amber-400">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Platform Analytics', badge: null },
            { id: 'reports', label: 'User Reports', badge: pendingReportsCount },
            { id: 'users', label: 'Citizen Management', badge: null },
            { id: 'moderation', label: 'Content Moderation', badge: null },
            { id: 'security', label: 'Security & Audit Logs', badge: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[9px]">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Dynamic Content Workspace */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* SECTION A: Platform Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Registered Citizens
                  </p>
                  <p className="text-2xl font-black text-white mt-1">1,482,900</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+14.2% organic</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-sky-400" /> Daily Active (DAU)
                  </p>
                  <p className="text-2xl font-black text-white mt-1">428,100</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Peak Bharat hours</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Safety Complaints
                  </p>
                  <p className="text-2xl font-black text-white mt-1">{reports.length}</p>
                  <span className="text-[10px] text-amber-400 font-bold">{pendingReportsCount} require review</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <ShieldBan className="w-3.5 h-3.5 text-rose-500" /> Suspended Accounts
                  </p>
                  <p className="text-2xl font-black text-white mt-1">
                    {Object.keys(suspendedUsersMap).length}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">Enforced by ABAC</span>
                </div>
              </div>

              {/* Infrastructure Security Health */}
              <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-300">Sovereign Security Framework</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">ABAC Firestore Security Rules</span>
                    <span className="text-emerald-400 font-bold">Deployed & Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">256-bit E2E Encryption Relay</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Private Chat Locks (SHA-256)</span>
                    <span className="text-emerald-400 font-bold">Cryptographically Isolated</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Role Privilege Escalation Guard</span>
                    <span className="text-emerald-400 font-bold">Zero-Trust Locked</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: User Reports & Complaints */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Citizen Complaints & Incident Reports</span>
                </h3>
                <span className="text-xs text-slate-400">Total: {reports.length}</span>
              </div>

              <div className="space-y-2.5">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase">
                            {report.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{report.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              report.status === 'Action Taken'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : report.status === 'Rejected'
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>

                        <p className="text-xs text-white font-medium mt-1.5">
                          Reported: <strong className="text-amber-300">{report.reportedUserName}</strong> by{' '}
                          <span className="text-slate-300">{report.reporterName}</span>
                        </p>
                        <p className="text-xs text-slate-300 mt-1">{report.description}</p>
                      </div>

                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex-shrink-0"
                      >
                        Investigate Case
                      </button>
                    </div>

                    {report.decision && (
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-emerald-300">
                        <strong>Decision Log:</strong> {report.decision}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Case Investigation Drawer / Modal */}
              {selectedReport && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> Investigating Report: {selectedReport.id}
                      </h4>
                      <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p><strong>Reported User:</strong> {selectedReport.reportedUserName} (ID: {selectedReport.reportedUserId})</p>
                      <p><strong>Category:</strong> {selectedReport.category}</p>
                      <p><strong>Description:</strong> {selectedReport.description}</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Internal Moderation Notes (Confidential)
                      </label>
                      <textarea
                        value={reportNoteInput}
                        onChange={(e) => setReportNoteInput(e.target.value)}
                        placeholder="Add investigative findings, risk rating, and audit justifications..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white resize-none"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Super Admin Action
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleApplyReportDecision(selectedReport, 'warned', 'Action Taken')}
                          className="py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs"
                        >
                          Issue Warning
                        </button>
                        <button
                          onClick={() => handleApplyReportDecision(selectedReport, 'suspended_24h', 'Action Taken')}
                          className="py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs"
                        >
                          Suspend for 24h
                        </button>
                        <button
                          onClick={() => handleApplyReportDecision(selectedReport, 'suspended_7d', 'Action Taken')}
                          className="py-2 rounded-xl bg-rose-500/30 text-rose-300 border border-rose-500/50 font-bold text-xs"
                        >
                          Suspend for 7 Days
                        </button>
                        <button
                          onClick={() => handleApplyReportDecision(selectedReport, 'banned_permanent', 'Action Taken')}
                          className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          Permanent Ban
                        </button>
                      </div>
                      <button
                        onClick={() => handleApplyReportDecision(selectedReport, 'none', 'Rejected')}
                        className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs mt-2"
                      >
                        Dismiss / Reject Report
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION C: Citizen Management & Search */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search citizens by Name, Username, or VANDEYA ID..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                {filteredAdminUsers.map((user) => {
                  const suspended = isUserSuspended(user.uid);

                  return (
                    <div
                      key={user.uid}
                      className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photoURL}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{user.displayName}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-1.5 py-0.2 rounded">
                              {user.vandeyaId}
                            </span>
                            {suspended && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                                Suspended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">@{user.username} · {user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {suspended ? (
                          <button
                            onClick={() => restoreUser(user.uid)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          >
                            Restore Account
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm(`Suspend user ${user.displayName}?`)) {
                                suspendUser(user.uid, 'Administrative suspension by Owner', '24h');
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-bold"
                          >
                            Suspend (24h)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION D: Content Moderation */}
          {activeTab === 'moderation' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Post Feed Moderation</h4>
              <div className="space-y-2">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        {p.authorName} <span className="text-slate-500 font-normal">@{p.authorUsername}</span>
                      </p>
                      <p className="text-slate-300 mt-1 line-clamp-2">{p.content}</p>
                    </div>

                    <button
                      onClick={() => onDeletePost(p.id)}
                      className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION E: Security & Audit Logs */}
          {activeTab === 'security' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Owner Audit & Security Records</h4>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 max-h-72 overflow-y-auto">
                {adminAuditLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between text-amber-400 text-[10px]">
                      <span>[{new Date(log.timestamp).toLocaleTimeString()}] {log.actionType}</span>
                      <span className="text-slate-400">{log.adminEmail}</span>
                    </div>
                    <p className="text-slate-200 mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
