import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface MemorySlideshowProps {
  photos: string[];
}

export const MemorySlideshow: React.FC<MemorySlideshowProps> = ({ photos }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      triggerSlideChange((currentIndex + 1) % photos.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [photos.length, currentIndex]);

  if (!photos || photos.length === 0) return null;

  const triggerSlideChange = (newIndex: number) => {
    // Camera Flash Trigger
    setIsFlashing(true);
    playSparkle();
    setTimeout(() => setIsFlashing(false), 450);

    setCurrentIndex(newIndex);
    setCaptionIndex((prev) => (prev + 1) % t.memoryCaptions.length);
  };

  const handleNext = () => {
    triggerSlideChange((currentIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    triggerSlideChange((currentIndex - 1 + photos.length) % photos.length);
  };

  const activeCaption = t.memoryCaptions[captionIndex % t.memoryCaptions.length];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-3 select-none perspective-1000">
      
      {/* Title Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.sweetMemories}</span>
        </div>
        <span className="text-[11px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* 3D Container with Dynamic RGB Neon Border */}
      <div className="relative rgb-laser-border shadow-2xl shadow-purple-950/80 group">
        
        {/* Camera Flash Overlay */}
        {isFlashing && (
          <div className="absolute inset-0 z-30 animate-camera-flash rounded-3xl pointer-events-none" />
        )}

        <div className="rgb-laser-inner overflow-hidden relative aspect-square sm:aspect-[4/3] rounded-3xl">
          
          {/* Active Memory Photo with 3D Flying Entry Animation */}
          <div
            key={currentIndex}
            className="w-full h-full animate-fly-in overflow-hidden relative"
          >
            <img
              src={photos[currentIndex]}
              alt={`Memory ${currentIndex + 1}`}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
            />

            {/* Ambient Dark Gradient for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Heartfelt Dynamic Memory Badge on the photo */}
            <div className="absolute bottom-4 left-3 right-3 z-20">
              <div className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 animate-bounce">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs font-bold text-white font-['Kalam',sans-serif] leading-tight">
                  "{activeCaption}"
                </p>
              </div>
            </div>

            {/* Sparkles on Corner */}
            <div className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-rose-500/80 text-white shadow-lg animate-pulse">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-rose-500 hover:border-rose-400 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-rose-500 hover:border-rose-400 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-5 bg-gradient-to-r from-rose-400 to-amber-300' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
