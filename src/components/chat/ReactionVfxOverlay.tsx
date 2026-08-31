import React, { useEffect } from 'react';
import { ReactionType } from '../../types/gift';
import confetti from 'canvas-confetti';

interface ReactionVfxOverlayProps {
  reaction: ReactionType;
  onFinish: () => void;
}

export const ReactionVfxOverlay: React.FC<ReactionVfxOverlayProps> = ({ reaction, onFinish }) => {
  useEffect(() => {
    if (reaction === 'confetti') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF4D6D', '#38BDF8', '#C77DFF', '#10B981'],
      });
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [reaction, onFinish]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden animate-fade-in">
      
      {/* 1. ROSE REACTION (Raining Petals) */}
      {reaction === 'rose' && (
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-8xl animate-pulse">🌹</div>
          <div className="flex gap-4 text-3xl animate-ping pt-2">
            <span>🌸</span>
            <span>🌹</span>
            <span>🌸</span>
          </div>
        </div>
      )}

      {/* 2. BALLOON REACTION */}
      {reaction === 'balloon' && (
        <div className="flex gap-8 text-7xl animate-float">
          <span className="animate-bounce delay-100">🎈</span>
          <span className="animate-bounce delay-200">🎈</span>
          <span className="animate-bounce delay-300">🎈</span>
        </div>
      )}

      {/* 3. STAR REACTION */}
      {reaction === 'star' && (
        <div className="text-8xl animate-spin-slow">
          <span className="drop-shadow-[0_0_25px_rgba(255,215,0,0.9)]">⭐</span>
        </div>
      )}

      {/* 4. HUG REACTION */}
      {reaction === 'hug' && (
        <div className="flex items-center gap-2 text-8xl animate-pulse">
          <span>💖</span>
          <span>🫂</span>
          <span>💖</span>
        </div>
      )}

      {/* 5. COFFEE REACTION */}
      {reaction === 'coffee' && (
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-8xl">☕</div>
          <span className="text-2xl animate-pulse text-amber-300 font-bold">~ Warm Hug in a Cup ~</span>
        </div>
      )}

      {/* 6. MINI GIFT REACTION */}
      {reaction === 'gift' && (
        <div className="text-8xl animate-bounce">
          <span className="drop-shadow-[0_0_30px_rgba(255,77,109,0.8)]">🎁</span>
        </div>
      )}

      {/* 7. LAUGH BURST REACTION */}
      {reaction === 'laugh' && (
        <div className="flex gap-4 text-7xl animate-pulse">
          <span className="animate-spin-slow">😂</span>
          <span className="animate-bounce">🤣</span>
          <span className="animate-spin-slow">😂</span>
        </div>
      )}

    </div>
  );
};
