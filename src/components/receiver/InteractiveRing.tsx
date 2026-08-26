import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveRing: React.FC = () => {
  const { playSparkle } = useAudio();
  const [gleams, setGleams] = useState(0);

  const handleTouch = () => {
    playSparkle();
    setGleams((prev) => prev + 1);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#38BDF8', '#7DD3FC', '#E0F2FE', '#FFD700'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <div
        onClick={handleTouch}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4 transition-transform hover:scale-110 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-sky-400/30 to-blue-600/40 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl animate-float">
          💎
        </div>
        <Sparkles className="absolute top-4 right-6 w-8 h-8 text-cyan-300 animate-spin-slow" />
      </div>

      <button
        onClick={handleTouch}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-400/25 hover:scale-105 active:scale-95 transition-all"
      >
        {gleams > 0 ? '✨ Shimmering with Eternal Love! 💖' : 'Tap the Diamond Ring to Shimmer 💎'}
      </button>
    </div>
  );
};
