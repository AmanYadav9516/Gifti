import React from 'react';
import { Occasion } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { Sparkles, Heart, Cake, Gift, Users, Trophy, Smile, PartyPopper } from 'lucide-react';

interface OccasionSelectorProps {
  selected: Occasion;
  onSelect: (occasion: Occasion) => void;
}

export const OccasionSelector: React.FC<OccasionSelectorProps> = ({ selected, onSelect }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();

  const occasionList: { id: Occasion; icon: React.ReactNode; color: string; badge?: string }[] = [
    { id: 'rakhi', icon: '🎀', color: 'from-amber-500/20 to-rose-500/30 border-amber-500/40', badge: 'Special' },
    { id: 'birthday', icon: '🎂', color: 'from-blue-500/20 to-indigo-500/30 border-blue-500/40' },
    { id: 'love', icon: '❤️', color: 'from-rose-500/20 to-red-500/30 border-rose-500/40' },
    { id: 'sister', icon: '👩', color: 'from-pink-500/20 to-purple-500/30 border-pink-500/40' },
    { id: 'brother', icon: '👨', color: 'from-cyan-500/20 to-blue-500/30 border-cyan-500/40' },
    { id: 'friendship', icon: '🫂', color: 'from-emerald-500/20 to-teal-500/30 border-emerald-500/40' },
    { id: 'anniversary', icon: '💍', color: 'from-yellow-500/20 to-amber-600/30 border-yellow-500/40' },
    { id: 'engagement', icon: '💎', color: 'from-cyan-500/20 to-blue-500/30 border-cyan-500/40' },
    { id: 'congratulations', icon: '🎉', color: 'from-orange-500/20 to-pink-500/30 border-orange-500/40' },
    { id: 'thankyou', icon: '💐', color: 'from-violet-500/20 to-fuchsia-500/30 border-violet-500/40' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
          {t.stepOccasion}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {occasionList.map((item) => {
          const isSelected = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playSparkle();
                onSelect(item.id);
              }}
              className={`relative flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500/25 to-pink-600/20 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-2xl select-none">{item.icon}</span>
              
              <div className="flex flex-col">
                <span className={`text-xs sm:text-sm font-semibold leading-tight ${isSelected ? 'text-white font-bold' : 'text-gray-300'}`}>
                  {t.occasions[item.id]}
                </span>
              </div>

              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-[9px] font-black text-black uppercase shadow">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
