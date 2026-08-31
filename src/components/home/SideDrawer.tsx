import React from 'react';
import { UserProfile } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Crown,
  Share2,
  Users,
  Shield,
  Languages,
  LogOut,
  Sparkles,
  Heart,
  Gift,
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onOpenVipCard: () => void;
  onOpenInvite: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  currentUser,
  onClose,
  onOpenVipCard,
  onOpenInvite,
  onOpenAdmin,
  onLogout,
}) => {
  const { language, setLanguage } = useLanguage();
  const { playSparkle } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-fade-in">
      
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      {/* Drawer Container */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-[#0E0B1F] border-r border-white/10 p-5 flex flex-col justify-between text-white z-10 shadow-2xl animate-slide-right">
        
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] shadow-lg">
                <div className="w-full h-full bg-[#0E0B1F] rounded-[14px] flex items-center justify-center text-xl">
                  🎁
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider text-white font-['Outfit'] uppercase">
                  GIFTI WORLD
                </h3>
                <p className="text-[9px] font-bold text-amber-300">
                  BY AAYU SOLUTION
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Mini Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-rose-400 shrink-0">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
              <p className="text-[10px] text-amber-300 font-mono truncate">@{currentUser.giftiId}</p>
              <p className="text-[9px] text-gray-400">VIP Member</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5 text-xs font-bold">
            
            {/* 1. 3D VIP Card */}
            <button
              onClick={() => {
                onClose();
                onOpenVipCard();
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-400/30 text-amber-200 flex items-center gap-3 transition-all"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'मेरा 3D VIP कार्ड' : 'My 3D Gifti VIP Card'}</span>
            </button>

            {/* 2. Invite Friends */}
            <button
              onClick={() => {
                onClose();
                onOpenInvite();
              }}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-200 flex items-center gap-3 transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'दोस्तों को इनवाइट करें' : 'Invite Your Heart Closer'}</span>
            </button>

            {/* 3. Admin Panel (If admin) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 flex items-center gap-3 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {/* 4. Language Switcher */}
            <button
              onClick={() => {
                playSparkle();
                setLanguage(language === 'hi' ? 'en' : 'hi');
              }}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-200 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span>{language === 'hi' ? 'भाषा (Language)' : 'Language (भाषा)'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase font-bold">
                {language === 'hi' ? 'हिंदी' : 'ENG'}
              </span>
            </button>

          </div>

        </div>

        {/* Footer with Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>

          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
            GIFTI • BY AAYU SOLUTION
          </p>
        </div>

      </div>
    </div>
  );
};
