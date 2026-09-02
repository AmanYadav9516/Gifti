import React from 'react';
import { UserProfile } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { isUserFollowing } from '../../services/followService';
import {
  X,
  MessageCircle,
  Gift,
  Crown,
  MapPin,
  Calendar,
  UserCheck2,
  UserPlus,
  Users,
  Sparkles,
  Heart,
} from 'lucide-react';

interface UserProfileViewModalProps {
  user: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onOpenChat: (user: { giftiId: string; name: string; avatarUrl?: string }) => void;
  onSendGift: (target: { giftiId: string; name: string }) => void;
  onToggleFollow: (user: UserProfile) => void;
  onViewVipCard: (user: UserProfile) => void;
}

export const UserProfileViewModal: React.FC<UserProfileViewModalProps> = ({
  user,
  currentUser,
  onClose,
  onOpenChat,
  onSendGift,
  onToggleFollow,
  onViewVipCard,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const isFollowing = isUserFollowing(currentUser, user.giftiId);
  const isMe = user.giftiId === currentUser.giftiId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0E0B1F] border border-rose-500/40 shadow-2xl text-center space-y-5 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-purple-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar with VIP Halo */}
        <div className="relative inline-block mx-auto pt-2">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-400/20">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <Crown className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 drop-shadow" />
        </div>

        {/* User Identity */}
        <div className="space-y-1">
          <h3 className="text-xl font-black font-['Outfit'] text-white">
            {user.name}
          </h3>
          <p className="text-sm font-mono font-bold text-amber-300">
            @{user.giftiId}
          </p>
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>{user.city || 'India'}</span>
          </div>
        </div>

        {/* Bio / Description */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-200 leading-relaxed italic">
          "{user.bio || '✨ Member of Gifti World • Spreading joy and surprises!'}"
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="space-y-0.5 border-r border-white/10">
            <span className="text-base font-black text-amber-300 font-mono">
              {(user.following || []).length}
            </span>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Following</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-base font-black text-rose-300 font-mono">
              {user.giftsSentCount || 0}
            </span>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Gifts Shared</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isMe ? (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2">
              
              {/* Follow / Yaari Button */}
              <button
                onClick={() => onToggleFollow(user)}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isFollowing
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck2 className="w-4 h-4" />
                    <span>Following ✓</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow (यारी करें)</span>
                  </>
                )}
              </button>

              {/* Message Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenChat({
                    giftiId: user.giftiId,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                  });
                }}
                className="py-2.5 px-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>GIFTU Chat</span>
              </button>
            </div>

            {/* Send 3D Gift Button */}
            <button
              onClick={() => {
                onClose();
                onSendGift({
                  giftiId: user.giftiId,
                  name: user.name,
                });
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Send 3D Interactive Gift 🎁</span>
            </button>
          </div>
        ) : null}

        {/* 3D VIP Card Link */}
        <button
          onClick={() => {
            onClose();
            onViewVipCard(user);
          }}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-all"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>View 3D VIP Identity Card ✨</span>
        </button>

      </div>
    </div>
  );
};
