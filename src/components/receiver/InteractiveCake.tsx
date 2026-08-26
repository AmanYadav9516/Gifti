import React, { useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveCake: React.FC = () => {
  const { t } = useLanguage();
  const { playCandleExtinguish, playSparkle } = useAudio();
  const [isBlownOut, setIsBlownOut] = useState(false);

  const handleBlowCandle = () => {
    if (isBlownOut) return;
    setIsBlownOut(true);
    playCandleExtinguish();

    // Birthday Fireworks Confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.45 },
      colors: ['#FFD700', '#FF4D6D', '#38BDF8', '#4ADE80', '#F472B6'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* 3D Birthday Cake */}
      <div
        onClick={handleBlowCandle}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center my-4 transition-transform hover:scale-105 active:scale-95"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-amber-400/30 to-rose-600/40 rounded-full blur-3xl animate-pulse" />

        {/* Candle Flame on Top */}
        <div className="relative z-20 flex flex-col items-center mb-[-12px]">
          {!isBlownOut ? (
            <div className="relative">
              <div className="w-5 h-7 rounded-full bg-gradient-to-t from-orange-500 via-yellow-300 to-white animate-pulse shadow-lg shadow-yellow-400/80" />
              <Flame className="w-6 h-6 text-yellow-300 absolute -top-1 left-1/2 -translate-x-1/2 animate-bounce opacity-80" />
            </div>
          ) : (
            <div className="text-xs text-gray-400 font-bold animate-fade-in flex items-center gap-1">
              <span>💨 Wish Granted!</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          )}
          {/* Candle stick */}
          <div className="w-2.5 h-6 rounded-t-sm bg-gradient-to-b from-rose-400 to-pink-500 border border-white/40" />
        </div>

        {/* Cake Emoji / Visual */}
        <div className="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl animate-float">
          🎂
        </div>

      </div>

      {/* Tap Instruction */}
      <button
        onClick={handleBlowCandle}
        className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg ${
          isBlownOut
            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
            : 'bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-amber-400/25 hover:scale-105 active:scale-95'
        }`}
      >
        {isBlownOut ? '✨ Happy Birthday! May all your dreams come true! 🎉' : t.tapCakePrompt}
      </button>

    </div>
  );
};
