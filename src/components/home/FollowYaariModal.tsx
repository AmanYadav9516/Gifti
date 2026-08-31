import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { Heart, Sparkles, X, Users, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FollowYaariModalProps {
  targetName: string;
  onClose: () => void;
}

export const FollowYaariModal: React.FC<FollowYaariModalProps> = ({ targetName, onClose }) => {
  const { language } = useLanguage();
  const { playUnbox, playSparkle } = useAudio();

  useEffect(() => {
    playUnbox();
    playSparkle();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF4D6D', '#FFD700', '#38BDF8', '#C77DFF'],
    });
  }, [playUnbox, playSparkle]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-[#1E0C38] via-[#120724] to-[#080210] border-2 border-rose-500/50 shadow-2xl text-center space-y-4 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heart Icon */}
        <div className="relative inline-block mx-auto pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] shadow-xl animate-bounce">
            <div className="w-full h-full bg-[#120724] rounded-[14px] flex items-center justify-center text-3xl">
              🫂
            </div>
          </div>
          <Sparkles className="absolute -top-1.5 -right-1.5 w-6 h-6 text-amber-300 animate-spin-slow" />
        </div>

        {/* User's Exact Requested Text */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
            A NEW MAGICAL BOND CREATED
          </span>

          <h3 className="text-lg sm:text-xl font-black font-['Outfit'] text-white">
            NOW YOU AND <span className="text-gradient-rose">{targetName.toUpperCase()}</span> ARE FRIENDS! 🎉
          </h3>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-rose-400/30 space-y-1">
            <Heart className="w-5 h-5 text-rose-500 mx-auto fill-current animate-pulse" />
            <p className="text-xs sm:text-sm font-serif italic text-gray-200 font-bold leading-relaxed">
              "KEEP YOUR यारी / दोस्ती PROTECTED, NEVER FORGET THIS RELATION"
            </p>
          </div>
        </div>

        {/* Close action */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          Cherish This Yaari ❤️
        </button>

      </div>
    </div>
  );
};
