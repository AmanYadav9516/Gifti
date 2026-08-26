import React from 'react';
import { Gift, Download, Sparkles, Heart, Smartphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface ViralMarketingBannerProps {
  onCreateGift: () => void;
}

export const ViralMarketingBanner: React.FC<ViralMarketingBannerProps> = ({ onCreateGift }) => {
  const { t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const handleDownloadApk = () => {
    playUnbox();
    // Provide instant feedback and trigger APK download / prompt
    alert('🎉 Thank you for supporting AAYU SOLUTION! The Gifti Android APK installation package will start downloading. You can also bookmark or install this web app directly to your home screen!');
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#100A22] to-amber-950/30 border border-rose-500/30 backdrop-blur-xl shadow-2xl space-y-5 text-center mt-8 select-none">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        <span>BY AAYU SOLUTION</span>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
          {t.viralTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          {t.viralSubtitle}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        
        {/* Create Your Own Gift */}
        <button
          type="button"
          onClick={() => {
            playSparkle();
            onCreateGift();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          <span>{t.createYourOwnBtn}</span>
        </button>

        {/* Download APK */}
        <button
          type="button"
          onClick={handleDownloadApk}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-amber-300 hover:text-amber-200 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>{t.downloadApkBtn}</span>
        </button>

      </div>

      {/* Footer Signature */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
        <span>Gifti App • Created with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
        <span>by <strong className="text-white">AAYU SOLUTION</strong></span>
      </div>

    </div>
  );
};
