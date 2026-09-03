import React, { useState, useEffect } from 'react';
import { GiftData, Occasion, GiftType, WorldTheme, Relationship, UserProfile, ChatTheme } from './types/gift';
import { useLanguage } from './context/LanguageContext';
import { useAudio } from './context/AudioContext';
import { Header } from './components/common/Header';
import { SplashScreen } from './components/auth/SplashScreen';
import { AuthModal } from './components/auth/AuthModal';
import { SocialHomeHub } from './components/home/SocialHomeHub';
import { SideDrawer } from './components/home/SideDrawer';
import { GiftiVipCardModal } from './components/profile/GiftiVipCardModal';
import { GiftuChatModal } from './components/chat/GiftuChatModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BirthdaySurpriseModal } from './components/common/BirthdaySurpriseModal';
import { InviteModal } from './components/home/InviteModal';
import { UserProfileModal } from './components/home/UserProfileModal';
import { ChatThemeModal } from './components/home/ChatThemeModal';
import { FeedbackModal } from './components/home/FeedbackModal';
import { NetworkErrorNotice } from './components/common/NetworkErrorNotice';

// Creator Components
import { OccasionSelector } from './components/creator/OccasionSelector';
import { GiftSelector } from './components/creator/GiftSelector';
import { WorldSelector } from './components/creator/WorldSelector';
import { AIMessageWriter } from './components/creator/AIMessageWriter';
import { VoiceRecorder } from './components/creator/VoiceRecorder';
import { PhotoUploader } from './components/creator/PhotoUploader';
import { SurpriseScheduler } from './components/creator/SurpriseScheduler';
import { ShareModal } from './components/creator/ShareModal';
import { GiftJourney } from './components/receiver/GiftJourney';
import { loadGiftFromCurrentUrl } from './services/shareService';
import { getCachedCurrentUser, isUserBirthdayToday, clearUserSession } from './services/authService';
import { checkIncomingMessagesForUser } from './services/chatService';
import {
  initDailyCareScheduler,
  registerInAppToastListener,
  unregisterInAppToastListener,
  showChatMessageNotification,
  showGiftReceivedNotification,
} from './services/notificationService';
import {
  Sparkles,
  Sliders,
  Loader2,
  ArrowLeft,
  Eye,
  Bell,
  X,
} from 'lucide-react';

export const App: React.FC = () => {
  const { language, t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  // App Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // View Mode: 'hub' | 'create' | 'preview' | 'received'
  const [viewMode, setViewMode] = useState<'hub' | 'create' | 'preview' | 'received'>('hub');
  const [receivedGift, setReceivedGift] = useState<GiftData | null>(null);
  const [isLoadingGift, setIsLoadingGift] = useState<boolean>(true);

  // Modals & Navigation Overlays
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [selectedVipUser, setSelectedVipUser] = useState<UserProfile | null>(null);
  const [activeChatTarget, setActiveChatTarget] = useState<{ giftiId: string; name: string; avatarUrl?: string } | null>(null);
  const [chatTheme, setChatTheme] = useState<ChatTheme>('galaxy');
  const [showChatThemeModal, setShowChatThemeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // In-App Toast Notification
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);

  // Creator Form State
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [targetGiftiId, setTargetGiftiId] = useState<string | undefined>();
  const [relationship, setRelationship] = useState<Relationship>('sister');
  const [occasion, setOccasion] = useState<Occasion>('rakhi');
  const [giftType, setGiftType] = useState<GiftType>('rose');
  const [worldTheme, setWorldTheme] = useState<WorldTheme>('galaxy');
  const [message, setMessage] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | undefined>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState<number | undefined>();
  const [hasMysteryEnvelope, setHasMysteryEnvelope] = useState(true);
  const [hasMagicScratch, setHasMagicScratch] = useState(true);
  const [hasSecondGift, setHasSecondGift] = useState(false);
  const [secondaryGiftType, setSecondaryGiftType] = useState<GiftType>('chocolate');

  // Load chat theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gifti_chat_theme') as ChatTheme;
    if (savedTheme) setChatTheme(savedTheme);
  }, []);

  // In-App Floating Toast Listener
  useEffect(() => {
    registerInAppToastListener((toast) => {
      setInAppToast(toast);
      setTimeout(() => {
        setInAppToast(null);
      }, 5000);
    });

    return () => {
      unregisterInAppToastListener();
    };
  }, []);

  // REAL-TIME INCOMING MESSAGE & GIFT NOTIFICATION LISTENER
  useEffect(() => {
    if (!currentUser?.giftiId) return;

    let lastChecked = Date.now() - 5000;
    const interval = setInterval(async () => {
      const incoming = await checkIncomingMessagesForUser(currentUser.giftiId, lastChecked);
      lastChecked = Date.now();

      if (incoming.length > 0) {
        for (const msg of incoming) {
          // If not currently in chat with this user, trigger notification
          if (!activeChatTarget || activeChatTarget.giftiId.toLowerCase() !== msg.senderGiftiId.toLowerCase()) {
            showChatMessageNotification(
              msg.senderName,
              msg.photos?.length ? `📸 Sent ${msg.photos.length} 3D Memory Photos ✨` : msg.text
            );
          }
        }
      }
    }, 6000); // Check every 6 seconds

    return () => clearInterval(interval);
  }, [currentUser?.giftiId, activeChatTarget]);

  // ANDROID PHONE HARDWARE BACK BUTTON / BROWSER POPSTATE HANDLER
  useEffect(() => {
    window.history.pushState({ page: 'root' }, '');

    const handlePopState = () => {
      if (selectedVipUser) {
        setSelectedVipUser(null);
        window.history.pushState({ page: 'root' }, '');
      } else if (activeChatTarget) {
        setActiveChatTarget(null);
        window.history.pushState({ page: 'root' }, '');
      } else if (showChatThemeModal) {
        setShowChatThemeModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showFeedbackModal) {
        setShowFeedbackModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showAdminPanel) {
        setShowAdminPanel(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showInviteModal) {
        setShowInviteModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showProfileModal) {
        setShowProfileModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showBirthdayModal) {
        setShowBirthdayModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (showShareModal) {
        setShowShareModal(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (isSideDrawerOpen) {
        setIsSideDrawerOpen(false);
        window.history.pushState({ page: 'root' }, '');
      } else if (viewMode === 'create' || viewMode === 'preview') {
        setViewMode('hub');
        window.history.pushState({ page: 'root' }, '');
      } else {
        window.history.pushState({ page: 'root' }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    selectedVipUser,
    activeChatTarget,
    showChatThemeModal,
    showFeedbackModal,
    showAdminPanel,
    showInviteModal,
    showProfileModal,
    showBirthdayModal,
    showShareModal,
    isSideDrawerOpen,
    viewMode,
  ]);

  // Check persistent session & URL on initial mount
  useEffect(() => {
    const cached = getCachedCurrentUser();
    if (cached) {
      setCurrentUser(cached);
      setSenderName(cached.name);
      initDailyCareScheduler(cached.name);

      if (isUserBirthdayToday(cached.dob)) {
        setShowBirthdayModal(true);
      }
    } else {
      setShowAuthModal(true);
    }

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
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setSenderName(user.name);
    setShowAuthModal(false);
    initDailyCareScheduler(user.name);
    if (isUserBirthdayToday(user.dob)) {
      setShowBirthdayModal(true);
    }
  };

  const handleStartCreateGift = (target?: { giftiId: string; name: string }) => {
    if (target) {
      setReceiverName(target.name);
      setTargetGiftiId(target.giftiId);
    }
    setViewMode('create');
  };

  const handleGenerateGift = (e: React.FormEvent) => {
    e.preventDefault();
    playUnbox();
    setShowShareModal(true);
  };

  const handleCreateNewGift = (replyTarget?: { giftiId?: string; name: string }) => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setReceivedGift(null);
    if (replyTarget) {
      setReceiverName(replyTarget.name);
      setTargetGiftiId(replyTarget.giftiId);
      setViewMode('create');
    } else {
      setViewMode('hub');
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    setShowProfileModal(false);
    setShowAuthModal(true);
    setViewMode('hub');
  };

  const handleSelectChatTheme = (theme: ChatTheme) => {
    setChatTheme(theme);
    localStorage.setItem('gifti_chat_theme', theme);
  };

  // Construct active gift object
  const currentGiftData: GiftData = {
    id: 'gift_' + Date.now(),
    senderName: senderName || currentUser?.name || 'Someone who loves you',
    senderGiftiId: currentUser?.giftiId,
    receiverName: receiverName || 'Dearest One',
    receiverGiftiId: targetGiftiId,
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
    scheduledFor,
    createdAt: Date.now(),
  };

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Loading Received Gift from Cloud
  if (isLoadingGift && (window.location.search.includes('id=') || window.location.hash.includes('id=') || window.location.search.includes('g='))) {
    return (
      <div className="min-h-screen bg-[#070414] text-white flex flex-col items-center justify-center p-4 text-center">
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

  // 3. Received Mode (Fullscreen Gift Journey)
  if (viewMode === 'received' && receivedGift) {
    return (
      <div className="min-h-screen bg-[#080612] text-white">
        <Header currentView="preview" showNavigation={false} />
        <GiftJourney gift={receivedGift} onCreateNewGift={handleCreateNewGift} />
      </div>
    );
  }

  // 4. Preview Mode
  if (viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-[#080612] text-white">
        <Header currentView="preview" onViewChange={() => setViewMode('create')} />
        <GiftJourney gift={currentGiftData} onCreateNewGift={() => setViewMode('create')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080516] text-white flex flex-col justify-between selection:bg-rose-500">
      
      {/* Offline Network Error Recovery Banner */}
      <NetworkErrorNotice />

      {/* In-App Floating Notification Toast */}
      {inAppToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-3.5 rounded-2xl bg-[#160B2C]/95 border-2 border-amber-400/80 shadow-2xl backdrop-blur-2xl text-white flex items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-black text-amber-300 leading-tight truncate">
                {inAppToast.title}
              </h4>
              <p className="text-[11px] text-gray-200 leading-tight line-clamp-2">
                {inAppToast.body}
              </p>
            </div>
          </div>
          <button
            onClick={() => setInAppToast(null)}
            className="p-1 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Side Drawer Left Menu */}
      {currentUser && (
        <SideDrawer
          isOpen={isSideDrawerOpen}
          currentUser={currentUser}
          onClose={() => setIsSideDrawerOpen(false)}
          onOpenVipCard={() => setSelectedVipUser(currentUser)}
          onOpenInvite={() => setShowInviteModal(true)}
          onOpenAdmin={() => setShowAdminPanel(true)}
          onOpenEditProfile={() => setShowProfileModal(true)}
          onOpenChatTheme={() => setShowChatThemeModal(true)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
          onLogout={handleLogout}
        />
      )}

      {/* App Header */}
      <Header
        currentView={viewMode === 'hub' ? 'create' : 'create'}
        onViewChange={(v) => setViewMode(v === 'create' ? 'hub' : 'preview')}
      />

      {/* 1. SOCIAL HOME HUB VIEW */}
      {viewMode === 'hub' && currentUser && (
        <main className="flex-1 pb-16">
          <SocialHomeHub
            currentUser={currentUser}
            onOpenSideDrawer={() => setIsSideDrawerOpen(true)}
            onOpenVipCard={(u) => setSelectedVipUser(u || currentUser)}
            onOpenChatWithUser={(user) => setActiveChatTarget(user)}
            onStartCreateGift={handleStartCreateGift}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenInviteModal={() => setShowInviteModal(true)}
            onUpdateCurrentUser={(u) => setCurrentUser(u)}
          />
        </main>
      )}

      {/* 2. CREATOR STUDIO VIEW */}
      {viewMode === 'create' && (
        <main className="max-w-2xl mx-auto w-full px-4 py-4 pb-16 space-y-6">
          
          {/* Back to Hub Button */}
          <button
            onClick={() => setViewMode('hub')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Social Hub</span>
          </button>

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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
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
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* STEP 1: OCCASION */}
            <OccasionSelector selected={occasion} onSelect={setOccasion} />

            {/* STEP 2: GIFT */}
            <GiftSelector selected={giftType} onSelect={setGiftType} />

            {/* STEP 3: WORLD THEME */}
            <WorldSelector selected={worldTheme} onSelect={setWorldTheme} />

            {/* STEP 4: AI SMART MESSAGE WRITER */}
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

            {/* STEP 6: PHOTO MEMORIES */}
            <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

            {/* STEP 7: TIME-CAPSULE SURPRISE SCHEDULER (12:01 AM DELIVERY) */}
            <SurpriseScheduler
              scheduledFor={scheduledFor}
              onScheduleChange={setScheduledFor}
            />

            {/* STEP 8: SURPRISE ADD-ONS */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.stepSurpriseOptions}
                </h3>
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                  <input
                    type="checkbox"
                    checked={hasMysteryEnvelope}
                    onChange={(e) => {
                      playSparkle();
                      setHasMysteryEnvelope(e.target.checked);
                    }}
                    className="mt-1 w-4 h-4 text-rose-500 rounded accent-rose-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-white">{t.mysteryEnvelopeToggle}</span>
                    <span className="text-[11px] text-gray-400 leading-tight">{t.mysteryEnvelopeDesc}</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                  <input
                    type="checkbox"
                    checked={hasMagicScratch}
                    onChange={(e) => {
                      playSparkle();
                      setHasMagicScratch(e.target.checked);
                    }}
                    className="mt-1 w-4 h-4 text-rose-500 rounded accent-rose-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-white">{t.magicScratchToggle}</span>
                    <span className="text-[11px] text-gray-400 leading-tight">{t.magicScratchDesc}</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                  <input
                    type="checkbox"
                    checked={hasSecondGift}
                    onChange={(e) => {
                      playSparkle();
                      setHasSecondGift(e.target.checked);
                    }}
                    className="mt-1 w-4 h-4 text-rose-500 rounded accent-rose-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-white">{t.secondGiftToggle}</span>
                    <span className="text-[11px] text-gray-400 leading-tight">{t.secondGiftDesc}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-rose-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 animate-spin-slow" />
                <span>{t.generateGiftBtn}</span>
              </button>

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
      )}

      {/* OVERLAYS & MODALS */}
      
      {/* 1. Auth Modal (One-Time / Logout) */}
      {showAuthModal && !currentUser && (
        <AuthModal onSuccess={handleAuthSuccess} />
      )}

      {/* 2. 3D Holographic VIP Card Modal */}
      {selectedVipUser && (
        <GiftiVipCardModal
          user={selectedVipUser}
          onClose={() => setSelectedVipUser(null)}
        />
      )}

      {/* 3. GIFTU Magician 2-Way Chat Modal */}
      {activeChatTarget && currentUser && (
        <GiftuChatModal
          currentUser={currentUser}
          targetUser={activeChatTarget}
          chatTheme={chatTheme}
          onClose={() => setActiveChatTarget(null)}
          onSendDirectGift={(giftiId, name) => {
            setActiveChatTarget(null);
            handleStartCreateGift({ giftiId, name });
          }}
        />
      )}

      {/* 4. Chat Theme Modal */}
      {showChatThemeModal && (
        <ChatThemeModal
          currentTheme={chatTheme}
          onClose={() => setShowChatThemeModal(false)}
          onSelectTheme={handleSelectChatTheme}
        />
      )}

      {/* 5. Feedback & Star Rating Modal */}
      {showFeedbackModal && currentUser && (
        <FeedbackModal
          currentUser={currentUser}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}

      {/* 6. Secret Admin Control Panel */}
      {showAdminPanel && (
        <AdminDashboard onClose={() => setShowAdminPanel(false)} />
      )}

      {/* 7. 12:01 AM Birthday Surprise */}
      {showBirthdayModal && currentUser && (
        <BirthdaySurpriseModal
          user={currentUser}
          onClose={() => setShowBirthdayModal(false)}
        />
      )}

      {/* 8. Invite Modal */}
      {showInviteModal && currentUser && (
        <InviteModal
          currentUser={currentUser}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* 9. User Profile Edit Modal */}
      {showProfileModal && currentUser && (
        <UserProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUpdateUser={(u) => {
            setCurrentUser(u);
            setSenderName(u.name);
          }}
          onLogout={handleLogout}
        />
      )}

      {/* 10. Share Modal */}
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

      {/* Global Footer */}
      <footer className="py-4 border-t border-white/10 text-center text-xs text-gray-400 font-medium">
        <p>
          Gifti • {language === 'hi' ? 'दिलों को जोड़ने वाला सोशल ऐप' : 'Next-Gen Social Gifting Network'} • Crafted with ❤️ by{' '}
          <strong className="text-white">AAYU SOLUTION</strong>
        </p>
      </footer>

    </div>
  );
};
