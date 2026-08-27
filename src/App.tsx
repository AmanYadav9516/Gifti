import React, { useState, useEffect } from 'react';
import { GiftData, Occasion, GiftType, WorldTheme, Relationship } from './types/gift';
import { useLanguage } from './context/LanguageContext';
import { useAudio } from './context/AudioContext';
import { Header } from './components/common/Header';
import { OccasionSelector } from './components/creator/OccasionSelector';
import { GiftSelector } from './components/creator/GiftSelector';
import { WorldSelector } from './components/creator/WorldSelector';
import { AIMessageWriter } from './components/creator/AIMessageWriter';
import { VoiceRecorder } from './components/creator/VoiceRecorder';
import { PhotoUploader } from './components/creator/PhotoUploader';
import { ShareModal } from './components/creator/ShareModal';
import { GiftJourney } from './components/receiver/GiftJourney';
import { loadGiftFromCurrentUrl } from './services/shareService';
import {
  Sparkles,
  Gift as GiftIcon,
  Heart,
  Eye,
  Sliders,
  Loader2,
} from 'lucide-react';

export const App: React.FC = () => {
  const { language, t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  // Mode: 'create' | 'preview' | 'received'
  const [viewMode, setViewMode] = useState<'create' | 'preview' | 'received'>('create');
  const [receivedGift, setReceivedGift] = useState<GiftData | null>(null);
  const [isLoadingGift, setIsLoadingGift] = useState<boolean>(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('sister');
  const [occasion, setOccasion] = useState<Occasion>('rakhi');
  const [giftType, setGiftType] = useState<GiftType>('rose');
  const [worldTheme, setWorldTheme] = useState<WorldTheme>('galaxy');
  const [message, setMessage] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | undefined>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [hasMysteryEnvelope, setHasMysteryEnvelope] = useState(true);
  const [hasMagicScratch, setHasMagicScratch] = useState(true);
  const [hasSecondGift, setHasSecondGift] = useState(false);
  const [secondaryGiftType, setSecondaryGiftType] = useState<GiftType>('chocolate');

  // Check URL on mount for received gift
  useEffect(() => {
    async function checkUrlGift() {
      setIsLoadingGift(true);
      try {
        const giftFromUrl = await loadGiftFromCurrentUrl();
        if (giftFromUrl) {
          setReceivedGift(giftFromUrl);
          setViewMode('received');
        }
      } catch (err) {
        console.error('Error loading gift from URL:', err);
      } finally {
        setIsLoadingGift(false);
      }
    }

    checkUrlGift();

    const handleUrlChange = async () => {
      const g = await loadGiftFromCurrentUrl();
      if (g) {
        setReceivedGift(g);
        setViewMode('received');
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Construct active gift object
  const currentGiftData: GiftData = {
    id: 'gift_' + Date.now(),
    senderName: senderName || 'Someone who loves you',
    receiverName: receiverName || 'Dearest One',
    relationship,
    occasion,
    giftType,
    secondaryGiftType: hasSecondGift ? secondaryGiftType : undefined,
    worldTheme,
    message: message || (language === 'hi' 
      ? 'आपके लिए ढेर सारा प्यार और अनगिनत शुभकामनाएं! हमेशा ऐसे ही मुस्कुराते रहिए। ❤️' 
      : 'Sending you endless love, laughter, and blessings! Keep shining bright always. ❤️'),
    senderVoiceNote: voiceNoteUrl,
    photos,
    hasMysteryEnvelope,
    hasMagicScratch,
    hasSecondGift,
    enableAmbientMusic: true,
    createdAt: Date.now(),
  };

  const handleGenerateGift = (e: React.FormEvent) => {
    e.preventDefault();
    playUnbox();
    setShowShareModal(true);
  };

  const handleCreateNewGift = () => {
    // Clear URL parameters & switch to creator
    window.history.replaceState({}, document.title, window.location.pathname);
    setReceivedGift(null);
    setViewMode('create');
  };

  // If loading a gift from URL (?id=...)
  if (isLoadingGift && (window.location.search.includes('id=') || window.location.hash.includes('id=') || window.location.search.includes('g=') || window.location.hash.includes('g='))) {
    return (
      <div className="min-h-screen bg-[#090714] text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="p-6 rounded-3xl bg-white/5 border border-rose-500/30 backdrop-blur-xl shadow-2xl space-y-4 max-w-sm w-full">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] shadow-lg animate-pulse">
            <div className="w-full h-full bg-[#0E0B1F] rounded-[14px] flex items-center justify-center text-3xl">
              🎁
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Opening Your Special Surprise... ✨
            </h3>
            <p className="text-xs text-gray-400">
              Loading beautiful memories by AAYU SOLUTION
            </p>
          </div>
          <Loader2 className="w-6 h-6 text-rose-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // If in Received or Preview mode, render the Fullscreen Receiver Journey
  if (viewMode === 'received' && receivedGift) {
    return (
      <div className="min-h-screen bg-[#080612] text-white">
        <Header currentView="preview" showNavigation={false} />
        <GiftJourney gift={receivedGift} onCreateNewGift={handleCreateNewGift} />
      </div>
    );
  }

  if (viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-[#080612] text-white">
        <Header currentView="preview" onViewChange={() => setViewMode('create')} />
        <GiftJourney gift={currentGiftData} onCreateNewGift={() => setViewMode('create')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090714] text-white flex flex-col justify-between selection:bg-rose-500">
      
      {/* App Header */}
      <Header currentView="create" onViewChange={(view) => setViewMode(view)} />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden py-6 px-4 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डिजिटल गिफ्ट्स का नया जादुई अनुभव' : 'Next-Gen Interactive Digital Gifts'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">
            {language === 'hi' ? 'अपनों के लिए बनाएं ' : 'Create a Magical Gift for '}
            <span className="text-gradient-rose">
              {language === 'hi' ? 'दिल छू लेने वाला गिफ्ट' : 'Someone Special'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            {language === 'hi' 
              ? 'आवाज़, 3D खिलते फूल, यादों की तस्वीरें और AI से लिखे खूबसूरत शब्दों के साथ भेजें।'
              : 'Combine 3D petals, voice notes, photo memories, and AI-crafted words into an unforgettable unboxing.'}
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="max-w-2xl mx-auto w-full px-4 pb-16 space-y-6">
        <form onSubmit={handleGenerateGift} className="space-y-6">
          
          {/* SENDER & RECEIVER NAMES */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">
                {t.senderNameLabel}
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={t.senderNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">
                {t.receiverNameLabel}
              </label>
              <input
                type="text"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder={t.receiverNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>
          </div>

          {/* STEP 1: OCCASION */}
          <OccasionSelector selected={occasion} onSelect={setOccasion} />

          {/* STEP 2: GIFT */}
          <GiftSelector selected={giftType} onSelect={setGiftType} />

          {/* STEP 3: WORLD THEME */}
          <WorldSelector selected={worldTheme} onSelect={setWorldTheme} />

          {/* STEP 4: AI SMART MESSAGE WRITER (WITH 3 VARIATIONS & CONTEXT) */}
          <AIMessageWriter
            senderName={senderName}
            receiverName={receiverName}
            relationship={relationship}
            onRelationshipChange={setRelationship}
            occasion={occasion}
            message={message}
            onMessageChange={setMessage}
          />

          {/* STEP 5: VOICE RECORDER */}
          <VoiceRecorder
            voiceNoteUrl={voiceNoteUrl}
            onSaveVoiceNote={setVoiceNoteUrl}
          />

          {/* STEP 6: PHOTO MEMORIES (IMGBB HD CLOUD UPLOAD & 3D VFX) */}
          <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

          {/* STEP 7: SURPRISE ADD-ONS */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t.stepSurpriseOptions}
              </h3>
            </div>

            <div className="space-y-2.5 pt-1">
              
              {/* Mystery Envelope Toggle */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  checked={hasMysteryEnvelope}
                  onChange={(e) => {
                    playSparkle();
                    setHasMysteryEnvelope(e.target.checked);
                  }}
                  className="mt-1 w-4 h-4 text-rose-500 rounded focus:ring-rose-400 accent-rose-500"
                />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t.mysteryEnvelopeToggle}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-tight">
                    {t.mysteryEnvelopeDesc}
                  </span>
                </div>
              </label>

              {/* Magic Scratch Particle Glow Toggle */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  checked={hasMagicScratch}
                  onChange={(e) => {
                    playSparkle();
                    setHasMagicScratch(e.target.checked);
                  }}
                  className="mt-1 w-4 h-4 text-rose-500 rounded focus:ring-rose-400 accent-rose-500"
                />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t.magicScratchToggle}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-tight">
                    {t.magicScratchDesc}
                  </span>
                </div>
              </label>

              {/* Hidden 2nd Gift Toggle */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  checked={hasSecondGift}
                  onChange={(e) => {
                    playSparkle();
                    setHasSecondGift(e.target.checked);
                  }}
                  className="mt-1 w-4 h-4 text-rose-500 rounded focus:ring-rose-400 accent-rose-500"
                />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t.secondGiftToggle}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-tight">
                    {t.secondGiftDesc}
                  </span>
                </div>
              </label>

            </div>
          </div>

          {/* ACTION BUTTONS (GENERATE & PREVIEW) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            
            {/* Generate & Share */}
            <button
              type="submit"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-rose-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <span>{t.generateGiftBtn}</span>
            </button>

            {/* Live Preview Button */}
            <button
              type="button"
              onClick={() => {
                playSparkle();
                setViewMode('preview');
              }}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>{t.headerPreview}</span>
            </button>

          </div>

        </form>
      </main>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <ShareModal
          gift={currentGiftData}
          onClose={() => setShowShareModal(false)}
          onPreview={() => {
            setShowShareModal(false);
            setViewMode('preview');
          }}
        />
      )}

      {/* Global Brand Footer */}
      <footer className="py-4 border-t border-white/10 text-center text-xs text-gray-400 font-medium">
        <p>
          Gifti • {language === 'hi' ? 'दिलों को जोड़ने वाला ऐप' : 'Next-Gen E-Gift Experience'} • Crafted with ❤️ by{' '}
          <strong className="text-white">AAYU SOLUTION</strong>
        </p>
      </footer>

    </div>
  );
};
