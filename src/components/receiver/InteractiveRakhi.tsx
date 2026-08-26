import React, { useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveRakhi: React.FC = () => {
  const { t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();
  const [blessed, setBlessed] = useState(false);

  const handleRakhiTap = () => {
    playSparkle();
    playUnbox();
    setBlessed(true);

    // Sacred Gold & Red Confetti
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#E11D48', '#FFA500', '#FFF6BD'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* 3D Radiant Rakhi */}
      <div
        onClick={handleRakhiTap}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4 transition-transform hover:scale-110 active:scale-95"
      >
        {/* Divine Golden Halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/50 via-amber-400/40 to-red-600/40 rounded-full blur-3xl animate-pulse" />

        {/* Sacred Thread Horizontal Ribbons */}
        <div className="absolute left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 rounded-full shadow-lg" />

        {/* Center Rakhi Medallion */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-red-500 p-1.5 shadow-2xl shadow-amber-500/50 animate-float flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#18090C] border-2 border-amber-300 flex items-center justify-center text-5xl">
            🎀
          </div>
        </div>

        {/* Sparkles */}
        <Sparkles className="absolute top-4 right-6 w-6 h-6 text-amber-300 animate-spin-slow" />
        <Sparkles className="absolute bottom-4 left-6 w-5 h-5 text-yellow-200 animate-bounce" />
      </div>

      {/* Tap Instruction */}
      <button
        onClick={handleRakhiTap}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <ShieldCheck className="w-4 h-4 text-black" />
        <span>{blessed ? '✨ Sacred Bond of Protection & Love Blessed! 💖' : t.tapRakhiPrompt}</span>
      </button>

    </div>
  );
};
