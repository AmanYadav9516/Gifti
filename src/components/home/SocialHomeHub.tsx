import React, { useState, useEffect } from 'react';
import { UserProfile, Relationship } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { firestoreQueryCollection } from '../../services/firebase';
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
  QrCode,
  Shield,
  Plus,
  HelpCircle,
  X,
  ExternalLink,
  Award,
} from 'lucide-react';

interface SocialHomeHubProps {
  currentUser: UserProfile;
  onOpenChatWithUser: (user: { giftiId: string; name: string; avatarUrl?: string }) => void;
  onStartCreateGift: (target?: { giftiId: string; name: string }) => void;
  onOpenAdminPanel: () => void;
  onOpenProfile: () => void;
  onOpenInviteModal: () => void;
}

export const SocialHomeHub: React.FC<SocialHomeHubProps> = ({
  currentUser,
  onOpenChatWithUser,
  onStartCreateGift,
  onOpenAdminPanel,
  onOpenProfile,
  onOpenInviteModal,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [activeCategory, setActiveCategory] = useState<'friends' | 'parents' | 'heart_closer' | 'relatives'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);

  // Load directory
  useEffect(() => {
    async function loadDirectory() {
      const users = await firestoreQueryCollection('users');
      setAllUsers(users as unknown as UserProfile[]);
    }
    loadDirectory();

    // Check first-time tooltip state
    const hasSeen = localStorage.getItem('gifti_seen_home_guide');
    if (!hasSeen) {
      setShowFirstTimeTooltip(true);
    }
  }, []);

  const dismissTooltip = () => {
    localStorage.setItem('gifti_seen_home_guide', 'true');
    setShowFirstTimeTooltip(false);
  };

  // Filter users by search and categories
  const filteredUsers = allUsers.filter((u) => {
    if (u.giftiId === currentUser.giftiId) return false;
    if (searchQuery.trim()) {
      return (
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.giftiId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-4 space-y-5 select-none">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#130E2B] to-rose-950/60 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Glow Halo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* User Info */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onOpenProfile}
            className="relative group w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-400 shadow-lg shrink-0"
          >
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
              Edit
            </div>
          </button>

          <div className="flex-1 overflow-hidden">
            <h2 className="text-base sm:text-lg font-black text-white truncate flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              {currentUser.role === 'admin' && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
                  ADMIN
                </span>
              )}
            </h2>
            <p className="text-xs text-amber-300 font-mono truncate">
              @{currentUser.giftiId}
            </p>
            <p className="text-[11px] text-gray-400">
              📍 {currentUser.city || 'India'}
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Admin Dashboard Button if admin */}
          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenAdminPanel}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Invite Button */}
          <button
            onClick={onOpenInviteModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Friends</span>
          </button>

          {/* Create Standalone Gift */}
          <button
            onClick={() => onStartCreateGift()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Gift</span>
          </button>
        </div>

      </div>

      {/* FIRST TIME MAGIC TOOLTIP (SHOWS ONCE) */}
      {showFirstTimeTooltip && (
        <div className="relative p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-rose-500/20 border border-amber-400/50 shadow-xl flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-white">
                {language === 'hi' ? 'स्वागत है GIFTI फैमिली में! 🪄' : 'Welcome to the Gifti Magic Hub! 🪄'}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {language === 'hi'
                  ? 'आप किसी भी दोस्त से GIFTU मैजिशियन चैट कर सकते हैं, या सीधे उनकी Gifti ID पर दिल छू लेने वाला गिफ्ट भेज सकते हैं!'
                  : 'Chat with friends using GIFTU Magician animation or send instant 3D interactive gifts directly to their Gifti ID!'}
              </p>
            </div>
          </div>
          <button
            onClick={dismissTooltip}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SEARCH BAR (SEARCH BY GIFTI ID OR NAME) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'hi' ? 'Gifti ID या नाम से दोस्त खोजें...' : 'Search by @gifti_id or name...'}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-all shadow-inner"
        />
      </div>

      {/* CATEGORY TABS (Friends, Parents, Heart Closer, Relatives) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        
        {/* Friends */}
        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('friends');
          }}
          className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'friends'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'दोस्त (Friends)' : 'Friends'}</span>
        </button>

        {/* Parents & Family */}
        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('parents');
          }}
          className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'parents'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'माता-पिता (Parents)' : 'Parents & Family'}</span>
        </button>

        {/* Heart Closer */}
        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('heart_closer');
          }}
          className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'heart_closer'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
          <span>{language === 'hi' ? 'Heart Closer ❤️' : 'Heart Closer ❤️'}</span>
        </button>

        {/* Relatives */}
        <button
          onClick={() => {
            playSparkle();
            setActiveCategory('relatives');
          }}
          className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeCategory === 'relatives'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'रिश्तेदार (Relatives)' : 'Relatives'}</span>
        </button>

      </div>

      {/* USER LIST / DIRECTORY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
            {language === 'hi' ? 'आपके संपर्क व साथी' : 'People on Gifti'}
          </h3>
          <span className="text-[11px] text-amber-300 font-bold">
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
              Invite your heart-closer friends to join Gifti by sharing your direct link!
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
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-[#110D26] border border-white/10 hover:border-rose-500/40 transition-all shadow-md flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                    <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">
                      {u.name}
                    </h4>
                    <p className="text-xs text-amber-300 font-mono truncate">
                      @{u.giftiId}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {u.city ? `📍 ${u.city}` : 'Member of Gifti'}
                    </p>
                  </div>
                </div>

                {/* Actions: GIFTU Chat & Send Gift */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* Chat */}
                  <button
                    onClick={() => {
                      playSparkle();
                      onOpenChatWithUser({
                        giftiId: u.giftiId,
                        name: u.name,
                        avatarUrl: u.avatarUrl,
                      });
                    }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white transition-all shadow-sm"
                    title="GIFTU Magic Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
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
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white transition-all shadow-sm"
                    title="Send Digital Gift"
                  >
                    <Gift className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
