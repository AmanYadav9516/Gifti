import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface MemorySlideshowProps {
  photos: string[];
}

export const MemorySlideshow: React.FC<MemorySlideshowProps> = ({ photos }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (!photos || photos.length === 0) return null;

  const handleNext = () => {
    playSparkle();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    playSparkle();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{t.sweetMemories}</span>
        </div>
        <span className="text-[11px] text-gray-400 font-semibold">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* Polaroid / Film Frame */}
      <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#15102A] p-2 border-2 border-white/15 shadow-2xl shadow-rose-950/50 group">
        
        {/* Memory Image with Smooth Ken-Burns scale */}
        <img
          src={photos[currentIndex]}
          alt={`Memory ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-2xl transition-all duration-700 hover:scale-105"
        />

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Indicator dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentIndex === i ? 'w-4 bg-rose-400' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
