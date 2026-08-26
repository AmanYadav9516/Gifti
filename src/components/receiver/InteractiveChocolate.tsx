import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveChocolate: React.FC = () => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();
  const [bites, setBites] = useState(0);

  const handleBite = () => {
    playSparkle();
    setBites((prev) => prev + 1);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#78350F', '#B45309', '#FBBF24', '#FDE68A'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <div
        onClick={handleBite}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4 transition-transform hover:scale-110 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-800/40 via-amber-600/30 to-amber-950/40 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl animate-float">
          🍫
        </div>
        {bites > 0 && (
          <div className="absolute -top-4 px-3 py-1 rounded-full bg-amber-600/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-lg animate-bounce">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Sweetness x{bites}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleBite}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-700/25 hover:scale-105 active:scale-95 transition-all"
      >
        {t.tapChocolatePrompt}
      </button>
    </div>
  );
};
