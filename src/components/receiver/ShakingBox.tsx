import React, { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface ShakingBoxProps {
  onOpen: () => void;
  occasion?: string;
}

export const ShakingBox: React.FC<ShakingBoxProps> = ({ onOpen, occasion }) => {
  const { t } = useLanguage();
  const { playUnbox, playSparkle } = useAudio();
  const [isOpening, setIsOpening] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleBoxTap = () => {
    if (isOpening) return;
    playSparkle();
    setTapCount((prev) => prev + 1);

    if (tapCount >= 1 || true) {
      setIsOpening(true);
      playUnbox();

      // Dual burst confetti
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FF4D6D', '#FFD700', '#C77DFF', '#38BDF8', '#FFF'],
      });

      setTimeout(() => {
        onOpen();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] p-4 text-center select-none">
      
      <div className="mb-8 space-y-2 max-w-xs">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gradient-gold">
          {t.someoneThought}
        </p>
        <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
          {t.readyPrompt}
        </h3>
      </div>

      {/* Shaking Gift Box Visual */}
      <div
        onClick={handleBoxTap}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 cursor-pointer transition-transform duration-500 ${
          isOpening ? 'scale-125 opacity-0 rotate-12' : 'hover:scale-105 active:scale-95 animate-shake-infinite'
        }`}
      >
        {/* Glowing Background Radial Halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/40 via-amber-400/30 to-purple-600/40 rounded-3xl blur-2xl animate-pulse" />

        {/* 3D Box Body */}
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 border-2 border-rose-300/50 shadow-2xl flex items-center justify-center overflow-hidden">
          
          {/* Golden Ribbons */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-md" />

          {/* Top Bow Knot */}
          <div className="absolute top-3 w-14 h-8 rounded-full border-4 border-amber-300 bg-amber-400/80 shadow-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-900" />
          </div>

          <span className="relative z-10 text-5xl select-none drop-shadow-md">
            🎁
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBoxTap}
        className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{t.openGiftBtn}</span>
      </button>

    </div>
  );
};
