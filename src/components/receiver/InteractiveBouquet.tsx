import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveBouquet: React.FC = () => {
  const { playSparkle } = useAudio();
  const [bloomed, setBloomed] = useState(false);

  const handleTouch = () => {
    playSparkle();
    setBloomed(true);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F472B6', '#C084FC', '#FDE047', '#4ADE80', '#FB7185'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <div
        onClick={handleTouch}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4 transition-transform hover:scale-110 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/40 via-pink-400/30 to-purple-600/40 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl animate-float">
          💐
        </div>
      </div>

      <button
        onClick={handleTouch}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-fuchsia-500/25 hover:scale-105 active:scale-95 transition-all"
      >
        {bloomed ? '🌸 Blooming with Joy & Warm Wishes! ✨' : 'Tap the Bouquet to Spread Fragrance 💐'}
      </button>
    </div>
  );
};
