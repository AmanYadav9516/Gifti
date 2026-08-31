import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../services/soundEffects';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSparkle: () => void;
  playUnbox: () => void;
  playHeartbeat: () => void;
  playCandleExtinguish: () => void;
  playWaxSealBreak: () => void;
  playNotificationChime: () => void;
  playReactionSound: (reaction?: string) => void;
  playAmbient: (theme: string) => void;
  stopAmbient: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.setMuted(nextState);
  };

  useEffect(() => {
    return () => {
      sounds.stopAmbient();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playSparkle: () => sounds.playSparkle(),
        playUnbox: () => sounds.playUnbox(),
        playHeartbeat: () => sounds.playHeartbeat(),
        playCandleExtinguish: () => sounds.playCandleExtinguish(),
        playWaxSealBreak: () => sounds.playWaxSealBreak(),
        playNotificationChime: () => sounds.playNotificationChime(),
        playReactionSound: (reaction?: string) => sounds.playReactionSound(reaction),
        playAmbient: (theme: string) => sounds.playAmbient(theme),
        stopAmbient: () => sounds.stopAmbient(),
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
