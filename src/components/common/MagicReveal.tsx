import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface MagicRevealProps {
  onComplete: () => void;
  secretQuote: string;
  senderName: string;
}

export const MagicReveal: React.FC<MagicRevealProps> = ({ onComplete, secretQuote, senderName }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealedPercent, setRevealedPercent] = useState(0);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fill with rich dark night sky
    ctx.fillStyle = '#06040e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw initial star sparkles
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 48, 0, Math.PI * 2);
      ctx.fill();

      // Sound sparkle throttled
      if (Math.random() < 0.15) {
        playSparkle();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDrawing.current = true;
      scratch(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing.current) return;
      scratch(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      isDrawing.current = false;
      // Estimate cleared area
      setRevealedPercent((prev) => Math.min(prev + 18, 100));
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [playSparkle]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center select-none overflow-hidden bg-black">
      
      {/* Background Revealed Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse-glow">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-gradient-gold">
            {senderName ? `${senderName} has a message for you...` : 'A hidden secret for you...'}
          </h3>
          
          <p className="text-base sm:text-lg text-rose-100/90 font-['Playfair_Display'] italic leading-relaxed px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            "{secretQuote || 'Some people make life brighter simply by being in it.'}"
          </p>

          <p className="text-xs text-amber-300/80 font-medium">
            ✨ {t.readyPrompt}
          </p>
        </div>
      </div>

      {/* Interactive Scratch Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 cursor-pointer touch-none"
      />

      {/* Floating Hint Overlay */}
      <div className="absolute bottom-10 z-30 flex flex-col items-center gap-3 pointer-events-auto">
        <p className="text-xs sm:text-sm text-gray-300 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 animate-bounce">
          👆 {t.scratchToReveal}
        </p>

        {revealedPercent >= 30 && (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{t.openGiftBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
