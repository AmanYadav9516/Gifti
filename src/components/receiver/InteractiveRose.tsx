import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const InteractiveRose: React.FC = () => {
  const { t } = useLanguage();
  const { playSparkle, playHeartbeat } = useAudio();
  const [petalsScattered, setPetalsScattered] = useState(false);
  const [heartCount, setHeartCount] = useState(0);

  const handleRoseTouch = () => {
    playSparkle();
    playHeartbeat();
    setPetalsScattered(true);
    setHeartCount((prev) => prev + 1);

    // Rose petals custom confetti
    confetti({
      particleCount: 35,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF4D6D', '#FF758F', '#FFB3C1', '#C9184A', '#FFE5EC'],
      shapes: ['circle'],
      scalar: 1.4,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* 3D Glowing Rose Element */}
      <div
        onClick={handleRoseTouch}
        className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4 transition-transform hover:scale-110 active:scale-95"
      >
        {/* Soft Pink Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/50 to-pink-400/40 rounded-full blur-3xl animate-pulse" />

        {/* Rose Visual */}
        <div className="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl animate-float">
          🌹
        </div>

        {/* Floating Petal Particles around rose */}
        <div className="absolute -top-2 right-4 text-2xl animate-bounce">
          🌸
        </div>
        <div className="absolute bottom-2 left-4 text-xl animate-float">
          ✨
        </div>

        {heartCount > 0 && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-lg animate-bounce">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Loved x{heartCount}</span>
          </div>
        )}
      </div>

      {/* Tap Instruction */}
      <p className="text-xs sm:text-sm text-rose-200 font-medium bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-full animate-pulse">
        {t.tapRosePrompt}
      </p>

    </div>
  );
};
