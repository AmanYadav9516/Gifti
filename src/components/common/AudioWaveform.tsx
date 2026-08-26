import React from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  color = 'bg-rose-400',
  barCount = 18,
}) => {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10 px-2">
      {Array.from({ length: barCount }).map((_, i) => {
        const heightMultiplier = [0.3, 0.6, 0.9, 0.4, 0.8, 1, 0.5, 0.7, 0.3, 0.85, 0.45, 0.95, 0.6, 0.4, 0.75, 0.5, 0.3, 0.2][i % 18];
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-150 ${color}`}
            style={{
              height: isPlaying ? `${Math.max(6, heightMultiplier * 36)}px` : '5px',
              animation: isPlaying ? `pulseGlow ${0.4 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
              opacity: isPlaying ? 0.9 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
};
