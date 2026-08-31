import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, ReactionType } from '../../types/gift';
import {
  sendChatMessage,
  fetchConversationMessages,
  getConversationId,
  setLiveTypingStatus,
  getLiveTypingStatus,
  setConversationPrivateMode,
  getConversationPrivateMode,
  sendReactionGift,
} from '../../services/chatService';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { ReactionVfxOverlay } from './ReactionVfxOverlay';
import {
  X,
  Send,
  Sparkles,
  Wand2,
  Lock,
  Clock,
  MessageCircle,
  ShieldAlert,
  Loader2,
  Gift,
  Flame,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GiftuChatModalProps {
  currentUser: UserProfile;
  targetUser: {
    giftiId: string;
    name: string;
    avatarUrl?: string;
  };
  onClose: () => void;
  onSendDirectGift: (giftiId: string, name: string) => void;
}

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'rose', emoji: '🌹', label: 'Rose' },
  { type: 'balloon', emoji: '🎈', label: 'Balloon' },
  { type: 'confetti', emoji: '🎉', label: 'Confetti' },
  { type: 'star', emoji: '⭐', label: 'Star' },
  { type: 'hug', emoji: '🫂', label: 'Hug' },
  { type: 'coffee', emoji: '☕', label: 'Coffee' },
  { type: 'gift', emoji: '🎁', label: 'Gift' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
];

export const GiftuChatModal: React.FC<GiftuChatModalProps> = ({
  currentUser,
  targetUser,
  onClose,
  onSendDirectGift,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox, playReactionSound, playNotificationChime } = useAudio();

  const conversationId = getConversationId(currentUser.giftiId, targetUser.giftiId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatMode, setChatMode] = useState<'magic' | 'classic'>('magic');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isOppositeTyping, setIsOppositeTyping] = useState(false);
  const [showReactionsBar, setShowReactionsBar] = useState(false);
  const [activeVfx, setActiveVfx] = useState<ReactionType | null>(null);

  // GIFTU Animation States
  const [isAnimatingGiftu, setIsAnimatingGiftu] = useState(false);
  const [animatingMsgText, setAnimatingMsgText] = useState('');
  const [giftuStage, setGiftuStage] = useState<'wand_rotate' | 'box_morph' | 'burst_reveal' | 'idle'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages, synchronized private mode, and typing state
  useEffect(() => {
    let isMounted = true;

    async function poll() {
      const [msgs, privState] = await Promise.all([
        fetchConversationMessages(conversationId),
        getConversationPrivateMode(conversationId),
      ]);

      if (isMounted) {
        setMessages(msgs);
        setIsPrivate(privState);
        setIsOppositeTyping(getLiveTypingStatus(conversationId, targetUser.giftiId));
      }
    }

    poll();
    const interval = setInterval(poll, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId, targetUser.giftiId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnimatingGiftu, isOppositeTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    setLiveTypingStatus(conversationId, currentUser.giftiId, val.length > 0);
  };

  const handleTogglePrivateMode = async () => {
    const nextState = !isPrivate;
    playSparkle();
    setIsPrivate(nextState);
    await setConversationPrivateMode(conversationId, nextState);
  };

  const handleTriggerReaction = async (reaction: ReactionType) => {
    playReactionSound(reaction);
    setActiveVfx(reaction);
    setShowReactionsBar(false);
    
    // Find latest message to attach reaction
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      await sendReactionGift(conversationId, latest.id, reaction);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setLiveTypingStatus(conversationId, currentUser.giftiId, false);

    if (chatMode === 'magic') {
      // 2-Way Synchronized GIFTU Sequence with Compact App-Icon Sized Box
      setIsAnimatingGiftu(true);
      setAnimatingMsgText(textToSend);
      setGiftuStage('wand_rotate');
      playSparkle();

      setTimeout(() => {
        setGiftuStage('box_morph');
        playSparkle();
      }, 800);

      setTimeout(() => {
        setGiftuStage('burst_reveal');
        playUnbox();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FF4D6D', '#38BDF8', '#C77DFF'],
        });
      }, 1600);

      setTimeout(async () => {
        setIsAnimatingGiftu(false);
        setGiftuStage('idle');
        const sent = await sendChatMessage({
          conversationId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderGiftiId: currentUser.giftiId,
          receiverGiftiId: targetUser.giftiId,
          text: textToSend,
          mode: 'magic',
          privacy: isPrivate ? 'private_1h' : 'friendly',
        });
        setMessages((prev) => [...prev, sent]);
      }, 2400);

    } else {
      // Classic Mode
      playSparkle();
      const sent = await sendChatMessage({
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderGiftiId: currentUser.giftiId,
        receiverGiftiId: targetUser.giftiId,
        text: textToSend,
        mode: 'classic',
        privacy: isPrivate ? 'private_1h' : 'friendly',
      });
      setMessages((prev) => [...prev, sent]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      
      {/* Live Reaction VFX Overlay */}
      {activeVfx && (
        <ReactionVfxOverlay reaction={activeVfx} onFinish={() => setActiveVfx(null)} />
      )}

      <div className="relative w-full max-w-xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#0C091C] border border-rose-500/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 blur-3xl pointer-events-none" />

        {/* CHAT HEADER */}
        <div className="relative z-10 px-4 py-3 border-b border-white/10 bg-black/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-rose-400/80 shadow-md">
              <img
                src={targetUser.avatarUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100'}
                alt={targetUser.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0C091C]" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1.5">
                <span>{targetUser.name}</span>
                <span className="text-xs font-normal text-amber-300">(@{targetUser.giftiId})</span>
              </h3>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>GIFTU 2-Way Magic Network</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Gift Button */}
            <button
              onClick={() => onSendDirectGift(targetUser.giftiId, targetUser.name)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send Gift</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: MAGIC/CLASSIC & SYNCHRONIZED PRIVATE MODE */}
        <div className="px-4 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-xs">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                playSparkle();
                setChatMode('magic');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                chatMode === 'magic'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3 h-3 text-amber-300" />
              <span>GIFTU Magic</span>
            </button>

            <button
              onClick={() => {
                playSparkle();
                setChatMode('classic');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                chatMode === 'classic'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3 h-3 text-cyan-300" />
              <span>Classic</span>
            </button>
          </div>

          {/* Synchronized Private Mode Toggle (Both convert!) */}
          <button
            onClick={handleTogglePrivateMode}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isPrivate
                ? 'bg-red-500/25 border border-red-500/40 text-red-300 animate-pulse'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {isPrivate ? (
              <>
                <Flame className="w-3 h-3 text-red-400" />
                <span>1-Hour Private Mode (Synced)</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>24h Auto-Purge (Friendly)</span>
              </>
            )}
          </button>

        </div>

        {/* Private Mode Synchronized Alert */}
        {isPrivate && (
          <div className="px-4 py-1.5 bg-red-950/50 border-b border-red-500/20 text-[11px] text-red-300 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Synchronized Private Mode Active: Messages vanish in 1 hour on both screens!</span>
          </div>
        )}

        {/* MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.length === 0 && !isAnimatingGiftu ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                🪄
              </div>
              <p className="text-sm font-bold text-white">Start your GIFTU magical conversation!</p>
              <p className="text-xs max-w-xs text-gray-400">
                Messages sent in Magic Mode transform into an app-icon-sized mystery box and reveal with fireworks!
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderGiftiId === currentUser.giftiId;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg relative ${
                      isMe
                        ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white rounded-br-none'
                        : 'bg-white/10 border border-white/15 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="font-medium">{m.text}</p>

                    {/* Reaction Badge if present */}
                    {m.reaction && (
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-full bg-black/80 border border-amber-400/40 text-xs shadow-md animate-bounce">
                        {REACTIONS.find((r) => r.type === m.reaction)?.emoji || '✨'}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-80">
                      <span className="font-bold text-amber-200">
                        {isMe ? 'You' : m.senderName}
                      </span>
                      <div className="flex items-center gap-1">
                        {m.mode === 'magic' && <Sparkles className="w-2.5 h-2.5 text-amber-300" />}
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* LIVE TYPING DISGUISE (RECEIVER SEES 🫰 🫰 🫰 🫰) */}
          {isOppositeTyping && (
            <div className="flex items-center gap-2 text-xs text-rose-300 p-2.5 rounded-2xl bg-white/5 border border-rose-500/30 w-max animate-pulse">
              <span className="text-base animate-bounce">🫰 🫰 🫰 🫰 🫰</span>
              <span className="font-bold">{targetUser.name} is typing a surprise...</span>
            </div>
          )}

          {/* 2-WAY LIVE GIFTU ANIMATION (COMPACT APP-ICON SIZED BOX) */}
          {isAnimatingGiftu && (
            <div className="my-4 p-5 rounded-3xl bg-gradient-to-b from-purple-950/90 to-[#0F0B26] border-2 border-amber-400/50 shadow-2xl text-center space-y-3 animate-fade-in relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15),transparent_70%)] pointer-events-none" />

              {/* STAGE 1: GIFTU Mascot Waves Wand */}
              {giftuStage === 'wand_rotate' && (
                <div className="space-y-2">
                  <div className="relative inline-block text-5xl animate-bounce">
                    🧙‍♂️
                    <span className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</span>
                  </div>
                  <h4 className="text-sm font-black text-amber-300 font-['Outfit']">
                    GIFTU is casting magic on your message... 🪄
                  </h4>
                  <p className="text-xs text-gray-300 italic">"{animatingMsgText}"</p>
                </div>
              )}

              {/* STAGE 2: Sleek App-Icon Sized Mystery Box */}
              {giftuStage === 'box_morph' && (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-xl animate-bounce">
                    <div className="w-full h-full bg-[#0E0B1F] rounded-[14px] flex items-center justify-center text-3xl">
                      🎁
                    </div>
                  </div>
                  <h4 className="text-xs font-black text-rose-300 font-['Outfit']">
                    Message sealed inside the Glowing App-Icon Box! ✨
                  </h4>
                </div>
              )}

              {/* STAGE 3: Fireworks Cracker Burst & Kinetic Reveal */}
              {giftuStage === 'burst_reveal' && (
                <div className="space-y-2">
                  <div className="text-5xl animate-ping">🎆</div>
                  <h4 className="text-base font-black text-gradient-gold font-['Outfit']">
                    CRACKER BURST! 🎉
                  </h4>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-amber-400/40 text-amber-200 text-xs font-bold animate-pulse">
                    "{animatingMsgText}"
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 8 REACTION GIFTS TRAY */}
        {showReactionsBar && (
          <div className="p-2.5 bg-[#140D2E] border-t border-white/10 flex items-center justify-around gap-1 animate-fade-in">
            {REACTIONS.map((r) => (
              <button
                key={r.type}
                onClick={() => handleTriggerReaction(r.type)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 hover:scale-125 active:scale-95 transition-all text-2xl flex flex-col items-center"
                title={r.label}
              >
                <span>{r.emoji}</span>
                <span className="text-[9px] font-bold text-gray-400 pt-0.5">{r.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* CHAT INPUT BAR */}
        <form onSubmit={handleSendMessage} className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2">
          
          {/* Reaction Toggle */}
          <button
            type="button"
            onClick={() => {
              playSparkle();
              setShowReactionsBar(!showReactionsBar);
            }}
            className={`p-2.5 rounded-2xl border transition-all ${
              showReactionsBar
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
            }`}
            title="Reaction Gifts"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={
              chatMode === 'magic'
                ? (language === 'hi' ? 'संदेश लिखें (GIFTU जादू करेगा)... 🪄' : 'Type message for GIFTU Magic... 🪄')
                : (language === 'hi' ? 'सामान्य संदेश लिखें...' : 'Type a message...')
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isAnimatingGiftu}
            className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-bold disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/30"
          >
            {isAnimatingGiftu ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : chatMode === 'magic' ? (
              <Wand2 className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
