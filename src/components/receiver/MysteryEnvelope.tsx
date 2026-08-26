import React, { useState } from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface MysteryEnvelopeProps {
  senderName: string;
  onOpened: () => void;
}

export const MysteryEnvelope: React.FC<MysteryEnvelopeProps> = ({ senderName, onOpened }) => {
  const { t } = useLanguage();
  const { playWaxSealBreak, playSparkle } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    playWaxSealBreak();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF4D6D', '#FFF6BD'],
    });

    setTimeout(() => {
      playSparkle();
      onOpened();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center select-none">
      
      {/* Intro Text */}
      <div className="mb-6 space-y-2 max-w-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-300">
          💌 {t.mysteryEnvelopePrompt}
        </p>
        <p className="text-xs text-gray-300">
          {senderName ? `From ${senderName}` : 'From someone who cares'}
        </p>
      </div>

      {/* 3D Envelope Element */}
      <div
        onClick={handleOpen}
        className={`relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl bg-gradient-to-br from-rose-900/90 via-red-950/95 to-stone-900 border-2 border-amber-400/40 shadow-2xl shadow-rose-950/60 cursor-pointer transition-all duration-700 hover:scale-105 ${
          isOpen ? 'scale-110 opacity-90' : 'animate-shake-infinite'
        }`}
      >
        {/* Envelope Top Flap Triangle */}
        <div
          className={`absolute top-0 left-0 right-0 h-24 border-b-2 border-amber-400/30 bg-gradient-to-b from-rose-800/80 to-transparent transition-transform duration-700 origin-top ${
            isOpen ? 'rotate-x-180 -translate-y-6 opacity-40' : ''
          }`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
        />

        {/* Envelope Center Details */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <p className="font-['Playfair_Display'] text-sm italic text-amber-100/80">
            For Someone Special ❤️
          </p>
        </div>

        {/* Red Wax Seal Stamp */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-red-800 via-rose-600 to-amber-600 border-2 border-amber-300 shadow-xl flex items-center justify-center text-white transition-transform duration-500 ${
            isOpen ? 'scale-0 opacity-0' : 'hover:scale-110 active:scale-95 animate-pulse'
          }`}
        >
          <div className="w-12 h-12 rounded-full border border-amber-300/60 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-amber-200 text-amber-200" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-spin-slow" />
        </div>

      </div>

      {/* Button / Tap Prompt */}
      <button
        onClick={handleOpen}
        className="mt-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all"
      >
        {t.tapToOpenEnvelope}
      </button>

    </div>
  );
};
