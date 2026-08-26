import React, { useState, useEffect, useRef } from 'react';
import { GiftData, GiftType } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { ParticleCanvas } from '../common/ParticleCanvas';
import { MagicReveal } from '../common/MagicReveal';
import { MysteryEnvelope } from './MysteryEnvelope';
import { ShakingBox } from './ShakingBox';
import { InteractiveRose } from './InteractiveRose';
import { InteractiveCake } from './InteractiveCake';
import { InteractiveRakhi } from './InteractiveRakhi';
import { InteractiveChocolate } from './InteractiveChocolate';
import { InteractiveRing } from './InteractiveRing';
import { InteractiveBouquet } from './InteractiveBouquet';
import { MemorySlideshow } from './MemorySlideshow';
import { AudioWaveform } from '../common/AudioWaveform';
import { ViralMarketingBanner } from './ViralMarketingBanner';
import {
  Sparkles,
  Heart,
  Volume2,
  Play,
  Pause,
  ArrowRight,
  Gift as GiftIcon,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GiftJourneyProps {
  gift: GiftData;
  onCreateNewGift: () => void;
}

type JourneyStage =
  | 'intro'
  | 'magic_scratch'
  | 'envelope'
  | 'shaking_box'
  | 'gift_reveal'
  | 'second_gift'
  | 'final_letter';

export const GiftJourney: React.FC<GiftJourneyProps> = ({ gift, onCreateNewGift }) => {
  const { t } = useLanguage();
  const { playSparkle, playUnbox, playAmbient, stopAmbient } = useAudio();

  const [stage, setStage] = useState<JourneyStage>('intro');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioVoiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    playAmbient(gift.worldTheme);
    return () => {
      stopAmbient();
      if (audioVoiceRef.current) {
        audioVoiceRef.current.pause();
      }
    };
  }, [gift.worldTheme, playAmbient, stopAmbient]);

  const handleStartJourney = () => {
    playSparkle();
    if (gift.hasMagicScratch) {
      setStage('magic_scratch');
    } else if (gift.hasMysteryEnvelope) {
      setStage('envelope');
    } else {
      setStage('shaking_box');
    }
  };

  const handleScratchComplete = () => {
    if (gift.hasMysteryEnvelope) {
      setStage('envelope');
    } else {
      setStage('shaking_box');
    }
  };

  const handleEnvelopeOpened = () => {
    setStage('shaking_box');
  };

  const handleBoxOpened = () => {
    setStage('gift_reveal');
  };

  const togglePlayVoiceNote = () => {
    if (!gift.senderVoiceNote) return;

    if (isPlayingVoice) {
      audioVoiceRef.current?.pause();
      setIsPlayingVoice(false);
    } else {
      if (!audioVoiceRef.current) {
        audioVoiceRef.current = new Audio(gift.senderVoiceNote);
        audioVoiceRef.current.onended = () => setIsPlayingVoice(false);
      } else {
        audioVoiceRef.current.src = gift.senderVoiceNote;
      }
      audioVoiceRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  const handleRevealSecondGift = () => {
    playUnbox();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF4D6D', '#C77DFF', '#38BDF8'],
    });
    setStage('second_gift');
  };

  const renderInteractiveGift = (type: GiftType) => {
    switch (type) {
      case 'rose':
        return <InteractiveRose />;
      case 'cake':
        return <InteractiveCake />;
      case 'rakhi':
        return <InteractiveRakhi />;
      case 'chocolate':
        return <InteractiveChocolate />;
      case 'ring':
        return <InteractiveRing />;
      case 'flowers':
        return <InteractiveBouquet />;
      case 'giftbox':
      default:
        return <InteractiveRose />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      {/* Dynamic Thematic Background Particles */}
      <ParticleCanvas theme={gift.worldTheme} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-xl mx-auto w-full">
        
        {/* 1. INTRO CINEMATIC SCREEN */}
        {stage === 'intro' && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in my-auto py-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-2xl shadow-rose-500/30 animate-pulse">
              <div className="w-full h-full bg-[#0E0B1F] rounded-[22px] flex items-center justify-center text-4xl">
                🎁
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <p className="text-sm font-semibold tracking-widest uppercase text-amber-300">
                {t.waitASec}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white leading-tight">
                {gift.receiverName ? `Dear ${gift.receiverName},` : 'Hey there,'}
              </h1>
              <p className="text-base sm:text-lg text-rose-100 font-['Playfair_Display'] italic leading-relaxed">
                "{gift.customIntroText || t.someoneThought}"
              </p>
            </div>

            <button
              onClick={handleStartJourney}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{t.tapToStart}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. MAGIC SCRATCH PARTICLES REVEAL */}
        {stage === 'magic_scratch' && (
          <MagicReveal
            senderName={gift.senderName}
            secretQuote={gift.customIntroText || 'Some people make life brighter simply by being in it.'}
            onComplete={handleScratchComplete}
          />
        )}

        {/* 3. WAX SEAL MYSTERY ENVELOPE */}
        {stage === 'envelope' && (
          <MysteryEnvelope
            senderName={gift.senderName}
            onOpened={handleEnvelopeOpened}
          />
        )}

        {/* 4. SHAKING GIFT BOX */}
        {stage === 'shaking_box' && (
          <ShakingBox onOpen={handleBoxOpened} occasion={gift.occasion} />
        )}

        {/* 5. PRIMARY GIFT REVEAL & SENSORY TOUCH */}
        {stage === 'gift_reveal' && (
          <div className="w-full space-y-6 text-center animate-fade-in py-4">
            
            {/* Occasion Header */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gradient-gold">
                {t.occasions[gift.occasion]}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                {gift.receiverName ? `For You, ${gift.receiverName} ❤️` : 'A Special Surprise for You ❤️'}
              </h2>
            </div>

            {/* Interactive 3D Gift */}
            {renderInteractiveGift(gift.giftType)}

            {/* Voice Note Attachment Player */}
            {gift.senderVoiceNote && (
              <div className="max-w-sm mx-auto p-4 rounded-2xl bg-white/10 border border-rose-400/40 backdrop-blur-md shadow-xl flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={togglePlayVoiceNote}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  {isPlayingVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t.listenVoiceNote}</span>
                  </span>
                  <AudioWaveform isPlaying={isPlayingVoice} color="bg-rose-400" barCount={14} />
                </div>
              </div>
            )}

            {/* Memory Photo Slideshow */}
            {gift.photos && gift.photos.length > 0 && (
              <div className="pt-2">
                <MemorySlideshow photos={gift.photos} />
              </div>
            )}

            {/* Next Action: Read Personal Letter or Open 2nd Gift */}
            <div className="pt-4 flex flex-col items-center gap-3">
              {gift.hasSecondGift ? (
                <button
                  onClick={handleRevealSecondGift}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-black font-extrabold text-sm shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{t.secondGiftAlert}</span>
                </button>
              ) : (
                <button
                  onClick={() => setStage('final_letter')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Read Personal Letter 💌</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* 6. SECOND GIFT REVEAL */}
        {stage === 'second_gift' && (
          <div className="w-full space-y-6 text-center animate-fade-in py-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                ✨ One More Surprise!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                {gift.secondaryGiftType ? t.gifts[gift.secondaryGiftType].name : 'Sweet Surprise 💖'}
              </h2>
            </div>

            {renderInteractiveGift(gift.secondaryGiftType || 'chocolate')}

            <button
              onClick={() => setStage('final_letter')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              <span>Read Personal Letter 💌</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 7. FINAL PERSONAL LETTER CARD & VIRAL MARKETING BANNER */}
        {stage === 'final_letter' && (
          <div className="w-full space-y-6 text-center animate-fade-in py-4">
            
            {/* Heartfelt Parchment Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1C1438] to-[#120B24] border border-rose-500/30 shadow-2xl space-y-4 text-left">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    {t.personalLetterFrom}
                  </span>
                </div>
                <span className="text-xs text-amber-300 font-semibold font-['Outfit']">
                  {gift.senderName ? `From ${gift.senderName}` : 'From Your Loved One'}
                </span>
              </div>

              <div className="py-2">
                <p className="text-base sm:text-lg text-white font-['Kalam',sans-serif] leading-relaxed whitespace-pre-wrap">
                  {gift.message}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                <span>Made with love on Gifti</span>
                <span className="font-semibold text-rose-300">Forever & Always ❤️</span>
              </div>
            </div>

            {/* Replay Journey Button */}
            <button
              type="button"
              onClick={() => setStage('gift_reveal')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Gift Experience</span>
            </button>

            {/* Promotional Viral Banner by AAYU SOLUTION */}
            <ViralMarketingBanner onCreateGift={onCreateNewGift} />

          </div>
        )}

      </main>

    </div>
  );
};
