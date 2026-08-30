import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { generateQrCodeUrl } from '../../services/shareService';
import {
  X,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  Smartphone,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';

interface InviteModalProps {
  currentUser: UserProfile;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ currentUser, onClose }) => {
  const { language } = useLanguage();
  const { playSparkle } = useAudio();

  // Direct APK download binary link + web app link
  const directApkUrl = 'https://github.com/AmanYadav9516/Gifti/releases/latest/download/Gifti-Android-APK.zip';
  const webAppUrl = 'https://amanyadav9516.github.io/Gifti/';
  const inviteUrl = `${webAppUrl}?ref=${currentUser.giftiId}`;

  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadQr() {
      const qr = await generateQrCodeUrl(inviteUrl);
      setQrCodeData(qr);
    }
    loadQr();
  }, [inviteUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    playSparkle();
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappText = `🎁 *Hey!* \n\n✨ *${currentUser.name}* invites you to join *Gifti — Next-Gen Interactive Digital Gifts & GIFTU Magic Chat!* \n\n👇 *Download APK & Open in 1 Tap:* \n${inviteUrl}\n\n_Crafted with ❤️ by AAYU SOLUTION_`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0E0B1F] border border-rose-500/30 shadow-2xl text-center space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            {language === 'hi' ? 'अपनों को Gifti पर आमंत्रित करें' : 'Invite Your Heart Closer Friends ❤️'}
          </h2>
          <p className="text-xs text-gray-300">
            {language === 'hi'
              ? 'अपने दोस्तों को डायरेक्ट APK डाउनलोड और गिफ्ट शेयरिंग लिंक भेजें!'
              : 'Share your personal invite link or show your custom QR code!'}
          </p>
        </div>

        {/* QR Code Display */}
        {qrCodeData && (
          <div className="p-3 bg-white rounded-2xl inline-block shadow-xl mx-auto">
            <img src={qrCodeData} alt="Invite QR Code" className="w-40 h-40 mx-auto" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider pt-1">
              Scan to Download & Join
            </p>
          </div>
        )}

        {/* Copy Link Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/15 text-left">
          <div className="flex-1 overflow-hidden pr-2">
            <span className="text-[10px] font-bold text-amber-300 uppercase block">Your Invite Link</span>
            <span className="text-xs text-white font-mono truncate block">{inviteUrl}</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Share Buttons (WhatsApp & SMS) */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSparkle()}
            className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`sms:?body=${encodeURIComponent(whatsappText)}`}
            onClick={() => playSparkle()}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>SMS</span>
          </a>
        </div>

        {/* Direct APK Download Button */}
        <a
          href={directApkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Direct Android APK Binary Download</span>
        </a>

      </div>
    </div>
  );
};
