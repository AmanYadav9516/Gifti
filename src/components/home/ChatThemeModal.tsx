import React from 'react';
import { ChatTheme } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { X, Sparkles, Check } from 'lucide-react';

interface ChatThemeModalProps {
  currentTheme: ChatTheme;
  onClose: () => void;
  onSelectTheme: (theme: ChatTheme) => void;
}

const THEMES: { id: ChatTheme; name: string; desc: string; bg: string; border: string; preview: string }[] = [
  {
    id: 'galaxy',
    name: 'Cosmic Galaxy (Default)',
    desc: 'Deep purple nebula & starry dust',
    bg: 'from-[#1A0833] to-[#090214]',
    border: 'border-purple-500/50',
    preview: '🌌',
  },
  {
    id: 'neon_rose',
    name: 'Romantic Neon Rose',
    desc: 'Glowing pink laser lines & floating petals',
    bg: 'from-[#29081E] to-[#0F020B]',
    border: 'border-rose-500/50',
    preview: '🌹',
  },
  {
    id: 'cyber_dark',
    name: 'Cyberpunk Obsidian',
    desc: 'Matte black with cyan and amber cyber aura',
    bg: 'from-[#0A0D1A] to-[#020408]',
    border: 'border-cyan-500/50',
    preview: '⚡',
  },
  {
    id: 'sunset_gold',
    name: 'Royal Sunset Gold',
    desc: 'Warm golden shimmer & imperial luxury',
    bg: 'from-[#291A06] to-[#0F0802]',
    border: 'border-amber-500/50',
    preview: '👑',
  },
];

export const ChatThemeModal: React.FC<ChatThemeModalProps> = ({
  currentTheme,
  onClose,
  onSelectTheme,
}) => {
  const { language } = useLanguage();
  const { playSparkle } = useAudio();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0E0B1F] border border-white/15 shadow-2xl text-center space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Atmosphere</span>
          </div>
          <h3 className="text-xl font-black font-['Outfit'] text-white">
            Choose Chat Theme 🎨
          </h3>
          <p className="text-xs text-gray-400">
            Customize the glowing ambiance of your GIFTU magic chat!
          </p>
        </div>

        {/* Theme List */}
        <div className="space-y-2.5 pt-2">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  playSparkle();
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 bg-gradient-to-r ${theme.bg} ${theme.border} transition-all hover:scale-[1.02] active:scale-95 ${
                  isSelected ? 'ring-2 ring-amber-400 shadow-xl' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.preview}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {theme.name}
                    </h4>
                    <p className="text-[11px] text-gray-300">{theme.desc}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
