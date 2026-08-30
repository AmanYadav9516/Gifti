import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../../types/gift';
import { sendChatMessage, fetchConversationMessages, getConversationId } from '../../services/chatService';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
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

export const GiftuChatModal: React.FC<GiftuChatModalProps> = ({
  currentUser,
  targetUser,
  onClose,
  onSendDirectGift,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const conversationId = getConversationId(currentUser.giftiId, targetUser.giftiId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatMode, setChatMode] = useState<'magic' | 'classic'>('magic');
  const [privacyMode, setPrivacyMode] = useState<'friendly' | 'private_1h'>('friendly');
  const [isAnimatingGiftu, setIsAnimatingGiftu] = useState(false);
  const [animatingMsgText, setAnimatingMsgText] = useState('');
  const [giftuStage, setGiftuStage] = useState<'wand_rotate' | 'box_morph' | 'burst_reveal' | 'idle'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load live messages and poll
  useEffect(() => {
    let isMounted = true;

    async function load() {
      const msgs = await fetchConversationMessages(conversationId);
      if (isMounted) {
        setMessages(msgs);
      }
    }

    load();
    const interval = setInterval(load, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnimatingGiftu]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (chatMode === 'magic') {
      // Trigger "GIFTU" Magician 3D Sequence
      setIsAnimatingGiftu(true);
      setAnimatingMsgText(textToSend);
      setGiftuStage('wand_rotate');
      playSparkle();

      // Stage 1: GIFTU Waves Wand (0 - 900ms)
      setTimeout(() => {
        setGiftuStage('box_morph');
        playSparkle();
      }, 900);

      // Stage 2: Mystery Box Flies & Bursts like crackers (900ms - 1800ms)
      setTimeout(() => {
        setGiftuStage('burst_reveal');
        playUnbox();
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FF4D6D', '#38BDF8', '#C77DFF'],
        });
      }, 1800);

      // Stage 3: Typewriter Finish & Dock (2700ms)
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
          privacy: privacyMode,
        });
        setMessages((prev) => [...prev, sent]);
      }, 2700);

    } else {
      // Classic Fast Mode
      playSparkle();
      const sent = await sendChatMessage({
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderGiftiId: currentUser.giftiId,
        receiverGiftiId: targetUser.giftiId,
        text: textToSend,
        mode: 'classic',
        privacy: privacyMode,
      });
      setMessages((prev) => [...prev, sent]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#0C091C] border border-rose-500/30 shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 blur-3xl pointer-events-none" />

        {/* CHAT HEADER */}
        <div className="relative z-10 px-4 py-3.5 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-rose-400/80 shadow-md">
              <img
                src={targetUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
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
                <span>GIFTU Magical Network Active</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct In-App Gift Button */}
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

        {/* MODE CONTROLS BAR (Magic vs Classic & Friendly vs 1-Hour Private) */}
        <div className="px-4 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-xs">
          
          {/* Chat Mode Toggle */}
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

          {/* Privacy Toggle (Friendly vs 1-Hour Private) */}
          <button
            onClick={() => {
              playSparkle();
              setPrivacyMode(privacyMode === 'friendly' ? 'private_1h' : 'friendly');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              privacyMode === 'private_1h'
                ? 'bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {privacyMode === 'private_1h' ? (
              <>
                <Flame className="w-3 h-3 text-red-400" />
                <span>1-Hour Auto Delete (Private)</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Friendly Mode</span>
              </>
            )}
          </button>

        </div>

        {/* 1-Hour Private Warning Banner if active */}
        {privacyMode === 'private_1h' && (
          <div className="px-4 py-1.5 bg-red-950/40 border-b border-red-500/20 text-[11px] text-red-300 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Private Chat Mode: Messages automatically vanish after 1 hour!</span>
          </div>
        )}

        {/* MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.length === 0 && !isAnimatingGiftu ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                🪄
              </div>
              <p className="text-sm font-bold text-white">Start your magical conversation!</p>
              <p className="text-xs max-w-xs text-gray-400">
                Messages sent in Magic Mode will be transformed by <strong>GIFTU The Magician</strong>!
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
                    {/* Message Text */}
                    <p className="font-medium">{m.text}</p>

                    {/* Sender Signature & Mode Badge */}
                    <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-80">
                      <span className="font-bold text-amber-200">
                        {isMe ? 'You' : m.senderName}
                      </span>
                      <div className="flex items-center gap-1">
                        {m.mode === 'magic' && <Sparkles className="w-2.5 h-2.5 text-amber-300" />}
                        {m.privacy === 'private_1h' && <Clock className="w-2.5 h-2.5 text-red-300" />}
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* THE "GIFTU" MAGICIAN LIVE ANIMATION SEQUENCE */}
          {isAnimatingGiftu && (
            <div className="my-6 p-6 rounded-3xl bg-gradient-to-b from-purple-950/80 to-[#0F0B26] border-2 border-amber-400/50 shadow-2xl text-center space-y-4 animate-fade-in relative overflow-hidden">
              
              {/* Particle Sparks Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15),transparent_70%)] pointer-events-none" />

              {/* STAGE 1: GIFTU Mascot Waves Wand */}
              {giftuStage === 'wand_rotate' && (
                <div className="space-y-3">
                  <div className="relative inline-block text-6xl animate-bounce">
                    🧙‍♂️
                    <span className="absolute -top-3 -right-3 text-3xl animate-spin-slow">✨</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-amber-300 font-['Outfit']">
                      GIFTU is casting magic on your message... 🪄
                    </h4>
                    <p className="text-xs text-gray-300 italic">
                      "{animatingMsgText}"
                    </p>
                  </div>
                </div>
              )}

              {/* STAGE 2: Box Morphs into Mystery Box */}
              {giftuStage === 'box_morph' && (
                <div className="space-y-3 animate-pulse">
                  <div className="text-6xl animate-bounce">
                    🎁
                  </div>
                  <h4 className="text-base font-black text-rose-300 font-['Outfit']">
                    Message sealed inside the Glowing Mystery Box! ✨
                  </h4>
                </div>
              )}

              {/* STAGE 3: Mystery Box Bursts Open like crackers */}
              {giftuStage === 'burst_reveal' && (
                <div className="space-y-3">
                  <div className="text-6xl animate-ping">
                    🎆
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-gradient-gold font-['Outfit']">
                      CRACKER BURST! 🎉
                    </h4>
                    <div className="p-3 rounded-xl bg-white/10 border border-amber-400/40 text-amber-200 text-sm font-bold animate-pulse">
                      "{animatingMsgText}"
                    </div>
                    <p className="text-[11px] font-bold text-rose-300 tracking-wider">
                      ~ Sent by {currentUser.name}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CHAT INPUT BAR */}
        <form onSubmit={handleSendMessage} className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
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
