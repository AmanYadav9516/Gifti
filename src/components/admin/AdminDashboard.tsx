import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/gift';
import {
  fetchAllUsersForAdmin,
  toggleUserBanStatus,
  fetchAdminAnalytics,
  computeUserLeaderboard,
  AdminAnalytics,
} from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  Shield,
  X,
  Users,
  Gift,
  MessageCircle,
  Award,
  Ban,
  CheckCircle,
  Search,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    totalUsers: 0,
    totalGifts: 0,
    totalChats: 0,
    activeToday: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'leaderboard' | 'analytics'>('users');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uList, stats] = await Promise.all([
        fetchAllUsersForAdmin(),
        fetchAdminAnalytics(),
      ]);
      setUsers(uList);
      setAnalytics(stats);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleBan = async (user: UserProfile) => {
    setUpdatingUserId(user.id);
    playSparkle();
    try {
      await toggleUserBanStatus(user.id, !!user.isBanned);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBanned: !u.isBanned } : u
        )
      );
    } catch (err) {
      console.error('Error updating ban status:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const { byGifts, byInvites } = computeUserLeaderboard(users);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.giftiId.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-4xl h-[92vh] rounded-3xl bg-[#0B081A] border-2 border-amber-500/40 shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-white flex items-center gap-2">
                <span>AAYU SOLUTION • Admin Control Panel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Master User Directory, Ban Controls, Leaderboard & App Metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS & ANALYTICS BAR */}
        <div className="p-4 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => {
                playSparkle();
                setActiveTab('users');
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'users' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Directory ({users.length})</span>
            </button>

            <button
              onClick={() => {
                playSparkle();
                setActiveTab('leaderboard');
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'leaderboard' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Leaderboard & Ranks</span>
            </button>
          </div>

          {/* Key Metrics Badges */}
          <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{users.length} Users</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              <span>{analytics.totalGifts} Gifts</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{analytics.totalChats} Chats</span>
            </div>
          </div>

        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: MASTER USER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user by Name, Gifti ID, Mobile, or City..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  <span>Loading User Directory...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No users found.</div>
              ) : (
                <div className="space-y-2.5">
                  {filteredUsers.map((u, idx) => (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        u.isBanned
                          ? 'bg-red-950/20 border-red-500/40 opacity-70'
                          : 'bg-white/5 border-white/10 hover:border-amber-400/40'
                      }`}
                    >
                      {/* Avatar & User Details */}
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                          <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                            <span className="text-xs font-mono text-amber-300">(@{u.giftiId})</span>
                            {u.isBanned && (
                              <span className="px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 text-[10px] font-bold border border-red-500/40">
                                BANNED
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1 text-emerald-300 font-mono">
                              <Phone className="w-3 h-3" />
                              {u.phone || 'No Phone'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-rose-300" />
                              DOB: {u.dob || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-cyan-300" />
                              {u.city || u.state ? `${u.city || ''}, ${u.state || ''}` : 'India'}
                            </span>
                            <span>Gender: {u.gender || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Ban Action */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleBan(u)}
                          disabled={updatingUserId === u.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            u.isBanned
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300'
                          }`}
                        >
                          {updatingUserId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.isBanned ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Unban User</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Ban User</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LEADERBOARD & RANKS */}
          {activeTab === 'leaderboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Leaderboard: Most Gifts Made */}
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Top Gift Makers 🎁
                  </h3>
                </div>

                <div className="space-y-2">
                  {byGifts.slice(0, 10).map((u, i) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-black text-sm ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          #{i + 1}
                        </span>
                        <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">@{u.giftiId}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                        {u.giftsSentCount || 0} Gifts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard: Most Invites / Referrals */}
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Top Community Referrers 🚀
                  </h3>
                </div>

                <div className="space-y-2">
                  {byInvites.slice(0, 10).map((u, i) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-black text-sm ${i === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                          #{i + 1}
                        </span>
                        <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">@{u.giftiId}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        {u.inviteCount || 0} Invites
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
