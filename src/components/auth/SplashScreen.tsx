import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { playSparkle, playUnbox } = useAudio();
  const [zoomOut, setZoomOut] = useState(false);

  useEffect(() => {
    playSparkle();

    const unboxTimer = setTimeout(() => {
      playUnbox();
    }, 1200);

    const zoomTimer = setTimeout(() => {
      setZoomOut(true);
    }, 2400);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(unboxTimer);
      clearTimeout(zoomTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, playSparkle, playUnbox]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070414] text-white select-none overflow-hidden transition-all duration-700 ${
        zoomOut ? 'scale-150 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
      }`}
    >
      {/* Radiant Glowing Background Halos */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-600/30 via-purple-600/25 to-amber-400/20 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg space-y-6">
        
        {/* Animated 3D Gift Icon */}
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[3px] shadow-2xl shadow-rose-500/40 animate-bounce">
          <div className="w-full h-full bg-[#0B081E] rounded-[22px] flex items-center justify-center text-5xl">
            🎁
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-amber-300 animate-spin-slow" />
        </div>

        {/* User's Exact Requested Text */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300 text-transparent bg-clip-text">
            THANKS TO BECOME A MEMBER OF
          </p>

          <h1 className="text-4xl sm:text-6xl font-black font-['Outfit'] tracking-tight text-white drop-shadow-2xl">
            GIFTI <span className="text-gradient-rose">FAMILY</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-200">
              WELCOME TO MAGICAL MOMENTS
            </span>
          </div>
        </div>

        {/* Brand signature */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80 pt-4">
          BY AAYU SOLUTION
        </p>

      </div>
    </div>
  );
};
