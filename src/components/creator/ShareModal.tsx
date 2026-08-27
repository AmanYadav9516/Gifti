import React, { useState, useEffect } from 'react';
import { GiftData } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  createShortGiftUrl,
  generateWhatsAppLink,
  generateSmsLink,
  generateQrCodeUrl,
} from '../../services/shareService';
import {
  X,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  gift: GiftData;
  onClose: () => void;
  onPreview: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ gift, onClose, onPreview }) => {
  const { t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initShareLink() {
      setIsLoading(true);
      try {
        const url = await createShortGiftUrl(gift);
        if (isMounted) {
          setShareUrl(url);
          const qr = await generateQrCodeUrl(url);
          setQrCodeData(qr);
          setIsLoading(false);

          // Launch celebration confetti
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FF4D6D', '#FFD700', '#C77DFF', '#38BDF8'],
          });
          playUnbox();
        }
      } catch (err) {
        console.error('Failed to create short URL:', err);
        setIsLoading(false);
      }
    }

    initShareLink();

    return () => {
      isMounted = false;
    };
  }, [gift, playUnbox]);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    playSparkle();
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsAppLink = generateWhatsAppLink(
    shareUrl,
    gift.receiverName,
    gift.senderName,
    gift.occasion
  );

  const smsLink = generateSmsLink(shareUrl, gift.receiverName, gift.senderName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#0F0C20] border border-rose-500/30 shadow-2xl shadow-rose-500/20 text-center space-y-5 overflow-hidden">
        
        {/* Ambient Halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-lg shadow-rose-500/30">
            <Sparkles className="w-7 h-7 animate-spin-slow" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            {t.shareTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
            {t.shareSubtitle}
          </p>
        </div>

        {/* Loading State or Short Link Display */}
        {isLoading ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
            <span className="text-xs font-bold text-rose-200">
              Saving to Cloud & Generating Short Link... ✨
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            
            {/* Display Short URL Pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-rose-500/40 text-left">
              <div className="flex-1 overflow-hidden pr-2">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  Short Gift Link (Ultra-Fast)
                </span>
                <span className="text-xs text-white font-mono truncate block">
                  {shareUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* WhatsApp Direct Share */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSparkle()}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/25 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t.shareWhatsApp}</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-rose-400" />}
                <span>{copied ? t.linkCopied : t.copyLink}</span>
              </button>

              {/* SMS Share */}
              <a
                href={smsLink}
                onClick={() => playSparkle()}
                className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>{t.shareSMS}</span>
              </a>
            </div>

            {/* QR Code Toggle */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{showQr ? 'Hide QR Code' : t.scanQR}</span>
            </button>

            {showQr && qrCodeData && (
              <div className="p-3 bg-white rounded-2xl inline-block shadow-xl animate-fade-in">
                <img src={qrCodeData} alt="Gift QR Code" className="w-44 h-44 mx-auto" />
              </div>
            )}

            {/* Direct Live Preview */}
            <button
              onClick={onPreview}
              className="w-full py-2.5 text-xs text-rose-300 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Preview Receiver Journey</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Branding Footer */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
            Crafted with ❤️ by <span className="text-gradient-gold">AAYU SOLUTION</span>
          </p>
        </div>

      </div>
    </div>
  );
};
