import React, { useEffect } from 'react';
import { UserProfile } from '../../types/gift';
import { useAudio } from '../../context/AudioContext';
import { Sparkles, Heart, Cake, Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BirthdaySurpriseModalProps {
  user: UserProfile;
  onClose: () => void;
}

const FAMOUS_QUOTES = [
  {
    author: 'Dr. A.P.J. Abdul Kalam',
    quote: 'Dream, dream, dream. Dreams transform into thoughts and thoughts result in action. May this year bring your highest dreams to life!',
  },
  {
    author: 'Swami Vivekananda',
    quote: 'Arise, awake, and stop not till the goal is reached. Wishing you a year filled with courage, wisdom, and boundless joy!',
  },
  {
    author: 'Albert Einstein',
    quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving. Keep shining bright and inspiring the world!',
  },
];

export const BirthdaySurpriseModal: React.FC<BirthdaySurpriseModalProps> = ({ user, onClose }) => {
  const { playUnbox, playSparkle } = useAudio();

  const selectedQuote = FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];

  useEffect(() => {
    playUnbox();
    playSparkle();

    // Launch celebratory fireworks
    const duration = 3000;
    const end = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FF4D6D', '#38BDF8', '#C77DFF', '#10B981'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [playSparkle, playUnbox]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1C0F38] via-[#120A24] to-[#070410] border-2 border-amber-400/60 shadow-2xl shadow-amber-500/25 text-center space-y-5 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Cake Icon */}
        <div className="relative inline-block mx-auto pt-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 p-[3px] shadow-2xl animate-bounce">
            <div className="w-full h-full bg-[#120A24] rounded-[21px] flex items-center justify-center text-5xl">
              🎂
            </div>
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-amber-300 animate-spin-slow" />
        </div>

        {/* Birthday Message Header */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">
            FIRST WISH FROM GIFTI TEAM & AAYU SOLUTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            Happy Birthday, <span className="text-gradient-rose">{user.name}</span>! 🎉
          </h2>
          <p className="text-xs text-gray-300">
            May your day be filled with love, laughter, and magical surprises!
          </p>
        </div>

        {/* Inspirational Quote Card */}
        <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-left space-y-2 relative">
          <Star className="absolute top-3 right-3 w-4 h-4 text-amber-400/50" />
          <p className="text-xs sm:text-sm text-gray-200 italic font-serif leading-relaxed">
            "{selectedQuote.quote}"
          </p>
          <p className="text-[11px] font-bold text-amber-300 text-right uppercase tracking-wider">
            — {selectedQuote.author}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Thank You, Gifti Family! ❤️
        </button>

      </div>
    </div>
  );
};
