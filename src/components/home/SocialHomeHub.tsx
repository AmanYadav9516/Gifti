import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { firestoreQueryCollection } from '../../services/firebase';
import { toggleFollowUser, isUserFollowing } from '../../services/followService';
import { FollowYaariModal } from './FollowYaariModal';
import {
  Sparkles,
  Search,
  MessageCircle,
  Gift,
  Users,
  Heart,
  Home,
  UserCheck,
  Share2,
  Menu,
  Crown,
  UserPlus,
  UserCheck2,
  Wand2,
  Award,
} from 'lucide-react';

interface SocialHomeHubProps {
  currentUser: UserProfile;
  onOpenSideDrawer: () => void;
  onOpenVipCard: () => void;
  onOpenChatWithUser: (user: { giftiId: string; name: string; avatarUrl?: string }) => void;
  onStartCreateGift: (target?: { giftiId: string; name: string }) => void;
  onOpenProfile: () => void;
  onOpenInviteModal: () => void;
  onUpdateCurrentUser: (user: UserProfile) => void;
}

export const SocialHomeHub: React.FC<SocialHomeHubProps> = ({
  currentUser,
  onOpenSideDrawer,
  onOpenVipCard,
  onOpenChatWithUser,
  onStartCreateGift,
  onOpenProfile,
  onOpenInviteModal,
  onUpdateCurrentUser,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [activeCategory, setActiveCategory] = useState<'friends' | 'parents' | 'heart_closer' | 'relatives'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [yaariModalTarget, setYaariModalTarget] = useState<string | null>(null);

  useEffect(() => {
    async function loadDirectory() {
      const users = await firestoreQueryCollection('users');
      setAllUsers(users as unknown as UserProfile[]);
    }
    loadDirectory();
  }, []);

  // Instagram-style letter-by-letter live substring search
  const filteredUsers = allUsers.filter((u) => {
    if (u.giftiId === currentUser.giftiId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.giftiId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFollowClick = async (targetUser: UserProfile) => {
    playSparkle();
    const { isFollowing, updatedUser } = await toggleFollowUser(currentUser, targetUser.giftiId);
    onUpdateCurrentUser(updatedUser);

    if (isFollowing) {
      setYaariModalTarget(targetUser.name);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-3 space-y-5 select-none">
      
      {/* Yaari Connection Modal on Follow */}
      {yaariModalTarget && (
        <FollowYaariModal
          targetName={yaariModalTarget}
          onClose={() => setYaariModalTarget(null)}
        />
      )}

      {/* 1. TOP BAR: SEARCH ON TOP + LEFT DRAWER MENU + RIGHT VIP CARD TRIGGER */}
      <div className="flex items-center gap-3">
        
        {/* Left Side Drawer Hamburger Toggle */}
        <button
          onClick={onOpenSideDrawer}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 shadow-lg shrink-0 hover:scale-105 active:scale-95 transition-all"
          title="Side Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar (Instagram Style Letter-by-Letter) */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'दोस्त या @gifti_id खोजें...' : 'Search friends or @gifti_id...'}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 shadow-inner transition-all"
          />
        </div>

        {/* Right VIP Card & Avatar Badge */}
        <button
          onClick={onOpenVipCard}
          className="relative group p-1 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 border border-amber-400/60 shadow-lg shrink-0 hover:scale-105 active:scale-95 transition-all"
          title="My 3D VIP Card"
        >
          <div className="w-9 h-9 rounded-[14px] overflow-hidden bg-black">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <Crown className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-300 drop-shadow-md" />
        </button>

      </div>

      {/* 2. DYNAMIC PERSONALIZED RGB NEON GREETING BANNER */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-[#120B26] to-rose-950/70 border border-white/15 shadow-2xl overflow-hidden text-center space-y-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 bg-gradient-to-r from-rose-500/25 via-amber-500/20 to-purple-500/25 blur-3xl pointer-events-none" />

        {/* Exact User Requested RGB Lighting Text */}
        <h1 className="text-lg sm:text-2xl font-black font-['Outfit'] tracking-tight animate-pulse">
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 via-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
            WELCOME MR. {currentUser.name.toUpperCase()}, WHAT'S GOING ON? ✨
          </span>
        </h1>

        <p className="text-xs text-gray-300">
          {language === 'hi'
            ? 'आपके अपने गिफ्ट और जादुई बातचीत का नया संसार • Powered by AAYU SOLUTION'
            : 'Your magical hub for 3D digital gifts, GIFTU chats, and cherished yaari.'}
        </p>
      </div>

      {/* 3. HERO CENTERPIECE: FLOWING RGB NEON GLOWING ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Create Gift (Animated RGB Border Focus) */}
        <div className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-rose-500 via-amber-400 via-cyan-400 to-purple-600 animate-pulse shadow-xl shadow-rose-500/20 hover:scale-[1.02] transition-all">
          <button
            onClick={() => onStartCreateGift()}
            className="w-full h-full p-4 rounded-[22px] bg-[#0E0A22] flex items-center justify-between gap-3 text-left"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>3D Interactive E-Gift</span>
              </span>
              <h3 className="text-base font-black text-white font-['Outfit']">
                {language === 'hi' ? 'गिफ्ट बनाएं 🎁' : 'Create a Gift 🎁'}
              </h3>
              <p className="text-[11px] text-gray-400">
                Rose, Cake, Rakhi, Photo Album & Voice
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🎁
            </div>
          </button>
        </div>

        {/* GIFTU Magic Chat (Animated RGB Border Focus) */}
        <div className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 via-amber-400 to-cyan-400 animate-pulse shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all">
          <button
            onClick={() => {
              if (filteredUsers.length > 0) {
                onOpenChatWithUser({
                  giftiId: filteredUsers[0].giftiId,
                  name: filteredUsers[0].name,
                  avatarUrl: filteredUsers[0].avatarUrl,
                });
              } else {
                onOpenInviteModal();
              }
            }}
            className="w-full h-full p-4 rounded-[22px] bg-[#0E0A22] flex items-center justify-between gap-3 text-left"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Wand2 className="w-3 h-3" />
                <span>2-Way Wand Magic & 🫰 Disguise</span>
              </span>
              <h3 className="text-base font-black text-white font-['Outfit']">
                {language === 'hi' ? 'GIFTU मैजिक चैट 🪄' : 'GIFTU Magic Chat 🪄'}
              </h3>
              <p className="text-[11px] text-gray-400">
                Flying box, Cracker burst & 24h purge
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🪄
            </div>
          </button>
        </div>

      </div>

      {/* 4. CATEGORY TABS (Friends, Parents, Heart Closer, Relatives) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('friends');
          }}
          className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'friends'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Friends</span>
        </button>

        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('parents');
          }}
          className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'parents'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Parents</span>
        </button>

        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('heart_closer');
          }}
          className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'heart_closer'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
          <span>Heart Closer ❤️</span>
        </button>

        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('relatives');
          }}
          className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'relatives'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Relatives</span>
        </button>
      </div>

      {/* 5. USER CONNECTIONS & YAARI DIRECTORY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
            {language === 'hi' ? 'आपके दोस्त व संबंध' : 'Your Network & Friends'}
          </h3>
          <span className="text-[11px] text-amber-300 font-bold font-mono">
            {filteredUsers.length} Users Found
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-sm font-bold text-white">No users found</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Share your direct invite link to connect with your heart-closer friends!
            </p>
            <button
              onClick={onOpenInviteModal}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
            >
              Invite Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredUsers.map((u) => {
              const isFollowing = isUserFollowing(currentUser, u.giftiId);
              return (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl bg-[#110D26] border border-white/10 hover:border-rose-500/40 transition-all shadow-md flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                      <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                      <p className="text-xs text-amber-300 font-mono truncate">@{u.giftiId}</p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {u.city ? `📍 ${u.city}` : 'Member of Gifti'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Follow/Yaari, GIFTU Chat & Send Gift */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    
                    {/* Follow/Yaari Button */}
                    <button
                      onClick={() => handleFollowClick(u)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                        isFollowing
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                      title={isFollowing ? 'Following (यारी)' : 'Follow (यारी करें)'}
                    >
                      {isFollowing ? <UserCheck2 className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    </button>

                    {/* GIFTU Chat */}
                    <button
                      onClick={() => {
                        playSparkle();
                        onOpenChatWithUser({
                          giftiId: u.giftiId,
                          name: u.name,
                          avatarUrl: u.avatarUrl,
                        });
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white transition-all"
                      title="GIFTU Magic Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    {/* Send Gift */}
                    <button
                      onClick={() => {
                        playUnbox();
                        onStartCreateGift({
                          giftiId: u.giftiId,
                          name: u.name,
                        });
                      }}
                      className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white transition-all"
                      title="Send Gift"
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
