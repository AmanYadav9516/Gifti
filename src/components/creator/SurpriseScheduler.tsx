import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { Clock, Calendar, Sparkles, Lock } from 'lucide-react';

interface SurpriseSchedulerProps {
  scheduledFor?: number;
  onScheduleChange: (timestamp?: number) => void;
}

export const SurpriseScheduler: React.FC<SurpriseSchedulerProps> = ({
  scheduledFor,
  onScheduleChange,
}) => {
  const { language } = useLanguage();
  const { playSparkle } = useAudio();

  const [isScheduled, setIsScheduled] = useState(!!scheduledFor);
  const [selectedDate, setSelectedDate] = useState('');
  const [isMidnightDefault, setIsMidnightDefault] = useState(true);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsScheduled(checked);
    playSparkle();

    if (!checked) {
      onScheduleChange(undefined);
    } else {
      updateTimestamp(selectedDate, isMidnightDefault);
    }
  };

  const updateTimestamp = (dateStr: string, midnight: boolean) => {
    if (!dateStr) return;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const target = new Date(year, month - 1, day, midnight ? 0 : 12, midnight ? 1 : 0);
      onScheduleChange(target.getTime());
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 shadow-xl">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {language === 'hi' ? 'TIME-CAPSULE सरप्राइज मोड (12:01 AM डिलीवरी)' : 'Time-Capsule Surprise Mode (12:01 AM Delivery)'}
        </h3>
      </div>

      <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
        <input
          type="checkbox"
          checked={isScheduled}
          onChange={handleToggle}
          className="mt-1 w-4 h-4 text-rose-500 rounded accent-rose-500"
        />
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <span>{language === 'hi' ? 'तय समय पर ही खुले (Locked Vault Until Date)' : 'Lock until a fixed date & 12:01 AM'}</span>
            <Lock className="w-3 h-3 text-amber-400" />
          </span>
          <span className="text-[11px] text-gray-400 leading-tight">
            {language === 'hi'
              ? 'यदि रिसीवर पहले लिंक खोलेगा, तो स्क्रीन पर लाइव उल्टी गिनती (Countdown) दिखेगी और ठीक 12:01 AM पर गिफ्ट अनलॉक होगा!'
              : 'Shows a locked glowing countdown vault if opened early, and automatically unboxes at 12:01 AM!'}
          </span>
        </div>
      </label>

      {isScheduled && (
        <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 space-y-2.5 animate-fade-in">
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डिलीवरी की तारीख चुनें' : 'Select Target Event Date'}</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                updateTimestamp(e.target.value, isMidnightDefault);
              }}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-gray-300">
            <span className="px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              ⚡ Fix 12:01 AM Midnight Auto-Unlock
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
