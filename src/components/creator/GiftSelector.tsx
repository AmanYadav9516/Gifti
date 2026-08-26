import React from 'react';
import { GiftType } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface GiftSelectorProps {
  selected: GiftType;
  onSelect: (gift: GiftType) => void;
}

export const GiftSelector: React.FC<GiftSelectorProps> = ({ selected, onSelect }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();

  const gifts: { id: GiftType; icon: string; highlightColor: string }[] = [
    { id: 'rose', icon: '🌹', highlightColor: 'hover:border-rose-400' },
    { id: 'giftbox', icon: '🎁', highlightColor: 'hover:border-amber-400' },
    { id: 'chocolate', icon: '🍫', highlightColor: 'hover:border-amber-600' },
    { id: 'cake', icon: '🎂', highlightColor: 'hover:border-pink-400' },
    { id: 'ring', icon: '💎', highlightColor: 'hover:border-cyan-400' },
    { id: 'rakhi', icon: '🎀', highlightColor: 'hover:border-yellow-400' },
    { id: 'flowers', icon: '💐', highlightColor: 'hover:border-fuchsia-400' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4 text-rose-400" />
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
          {t.stepGift}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {gifts.map((item) => {
          const isSelected = selected === item.id;
          const details = t.gifts[item.id];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playSparkle();
                onSelect(item.id);
              }}
              className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-purple-600/20 border-rose-400/80 shadow-lg shadow-rose-500/20 scale-[1.02]'
                  : `bg-white/5 border-white/10 ${item.highlightColor} hover:bg-white/10`
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {item.icon}
              </div>

              <div className="flex flex-col flex-1 pr-4">
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {details.name}
                </span>
                <span className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {details.desc}
                </span>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-rose-400 absolute top-3.5 right-3.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
