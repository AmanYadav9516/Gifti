import React from 'react';
import { Gift, Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface HeaderProps {
  currentView: 'create' | 'preview';
  onViewChange?: (view: 'create' | 'preview') => void;
  showNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, showNavigation = true }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isMuted, toggleMute, playSparkle } = useAudio();

  const handleLanguageToggle = () => {
    playSparkle();
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 bg-[#0B091A]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onViewChange?.('create')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0B091A] rounded-[14px] flex items-center justify-center">
              <Gift className="w-5 h-5 text-rose-400 animate-pulse-glow" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-bounce" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                Gift<span className="text-rose-500">i</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-rose-500 text-transparent bg-clip-text border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                by AAYU SOLUTION
              </span>
            </div>
            <span className="text-[10px] text-gray-400 tracking-wide font-medium hidden sm:block">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Toggle English / हिन्दी"
          >
            <Languages className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
              isMuted 
                ? 'bg-white/5 border-white/10 text-gray-500' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-sm shadow-rose-500/20'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Mode Switch (Optional) */}
          {showNavigation && (
            <button
              onClick={() => {
                playSparkle();
                onViewChange?.(currentView === 'create' ? 'preview' : 'create');
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentView === 'create' ? t.headerPreview : t.headerCreate}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
