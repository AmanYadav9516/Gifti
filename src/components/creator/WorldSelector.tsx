import React from 'react';
import { WorldTheme } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { Globe, Sparkles, Check } from 'lucide-react';

interface WorldSelectorProps {
  selected: WorldTheme;
  onSelect: (theme: WorldTheme) => void;
}

export const WorldSelector: React.FC<WorldSelectorProps> = ({ selected, onSelect }) => {
  const { t } = useLanguage();
  const { playSparkle, playAmbient } = useAudio();

  const worlds: { id: WorldTheme; icon: string; previewBg: string; borderGlow: string }[] = [
    {
      id: 'galaxy',
      icon: '🌌',
      previewBg: 'from-purple-900/60 via-indigo-950/80 to-black',
      borderGlow: 'border-purple-500/50',
    },
    {
      id: 'rosegarden',
      icon: '🌹',
      previewBg: 'from-pink-900/60 via-rose-950/80 to-black',
      borderGlow: 'border-rose-500/50',
    },
    {
      id: 'rainy',
      icon: '🌧️',
      previewBg: 'from-blue-900/60 via-slate-950/80 to-black',
      borderGlow: 'border-cyan-500/50',
    },
    {
      id: 'mountain',
      icon: '🏔️',
      previewBg: 'from-amber-900/60 via-orange-950/80 to-black',
      borderGlow: 'border-amber-500/50',
    },
    {
      id: 'christmas',
      icon: '🎄',
      previewBg: 'from-emerald-900/60 via-teal-950/80 to-black',
      borderGlow: 'border-emerald-500/50',
    },
    {
      id: 'festive',
      icon: '🎀',
      previewBg: 'from-red-900/60 via-amber-950/80 to-black',
      borderGlow: 'border-yellow-500/50',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
            {t.stepWorld}
          </h3>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          🎧 Includes Dynamic Music
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {worlds.map((item) => {
          const isSelected = selected === item.id;
          const details = t.worlds[item.id];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playSparkle();
                playAmbient(item.id);
                onSelect(item.id);
              }}
              className={`relative overflow-hidden flex flex-col p-3 rounded-2xl border text-left transition-all duration-200 bg-gradient-to-b ${item.previewBg} ${
                isSelected
                  ? `ring-2 ring-rose-400 ${item.borderGlow} scale-[1.03] shadow-lg shadow-rose-500/20`
                  : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-2xl">{item.icon}</span>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-gray-500 opacity-40" />
                )}
              </div>

              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                {details.name}
              </span>
              <span className="text-[10px] text-gray-300/80 mt-1 line-clamp-2 leading-tight">
                {details.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
