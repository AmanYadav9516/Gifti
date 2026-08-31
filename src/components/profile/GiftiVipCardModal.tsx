import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { generateQrCodeUrl } from '../../services/shareService';
import {
  X,
  Sparkles,
  Download,
  RotateCw,
  Share2,
  Check,
  Award,
  Crown,
  Heart,
  QrCode,
} from 'lucide-react';

interface GiftiVipCardModalProps {
  user: UserProfile;
  onClose: () => void;
}

export const GiftiVipCardModal: React.FC<GiftiVipCardModalProps> = ({ user, onClose }) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const inviteUrl = `https://amanyadav9516.github.io/Gifti/?ref=${user.giftiId}`;

  useEffect(() => {
    async function load() {
      const qr = await generateQrCodeUrl(inviteUrl);
      setQrCodeUrl(qr);
    }
    load();
  }, [inviteUrl]);

  const handleFlipCard = () => {
    playSparkle();
    setIsFlipped(!isFlipped);
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    playUnbox();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. Dark Luxury Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1600);
        grad.addColorStop(0, '#190A2E');
        grad.addColorStop(0.5, '#0E071A');
        grad.addColorStop(1, '#05020A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1600);

        // 2. Gold/Rose Neon Border
        ctx.strokeStyle = '#FF4D6D';
        ctx.lineWidth = 14;
        ctx.strokeRect(40, 40, 1000, 1520);

        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.strokeRect(60, 60, 960, 1480);

        // 3. Header Branding
        ctx.fillStyle = '#FFE27A';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GIFTI • OFFICIAL VIP IDENTITY CARD', 540, 140);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('CRAFTED BY AAYU SOLUTION', 540, 185);

        // 4. User Name & ID
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText(user.name, 540, 520);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 42px monospace';
        ctx.fillText(`@${user.giftiId}`, 540, 590);

        ctx.fillStyle = '#E2E8F0';
        ctx.font = '32px sans-serif';
        ctx.fillText(`📍 ${user.city || 'India'}  •  Member of Gifti World`, 540, 650);

        // 5. Card QR Code
        if (qrCodeUrl) {
          const img = new Image();
          img.src = qrCodeUrl;
          img.onload = () => {
            ctx.drawImage(img, 365, 780, 350, 350);

            ctx.fillStyle = '#FFE27A';
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText('SCAN TO JOIN & CONNECT', 540, 1200);

            ctx.fillStyle = '#CBD5E1';
            ctx.font = 'italic 30px serif';
            ctx.fillText('"Thanks for becoming a member of Gifti Family ❤️"', 540, 1340);

            // Export as PNG
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Gifti_VIP_Card_${user.giftiId}.png`;
            link.href = dataUrl;
            link.click();

            setDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
          };
        }
      }
    } catch (err) {
      console.warn('Canvas export fallback:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center text-center space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 right-0 sm:-right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-lg">
            <Crown className="w-3.5 h-3.5" />
            <span>Official VIP Member Card</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            Your 3D Holographic Card ✨
          </h2>
          <p className="text-[11px] text-gray-300">
            Tap card to flip front/back • Download & share on WhatsApp Status!
          </p>
        </div>

        {/* 3D FLOATING & FLIPPING CARD CONTAINER */}
        <div
          onClick={handleFlipCard}
          className="relative w-[300px] sm:w-[340px] h-[460px] cursor-pointer group transition-transform duration-500 [perspective:1000px] animate-float"
        >
          <div
            className={`relative w-full h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            
            {/* FRONT SIDE */}
            <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#1F0A38] via-[#100620] to-[#06020C] border-2 border-rose-500/50 p-6 flex flex-col justify-between [backface-visibility:hidden] shadow-2xl shadow-rose-500/20 overflow-hidden">
              
              {/* Neon Laser Glowing Border */}
              <div className="absolute inset-1 rounded-[22px] border border-amber-400/30 pointer-events-none" />

              {/* Holographic Top Bar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 text-left">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-amber-300 font-['Outfit'] uppercase">
                      GIFTI WORLD
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 tracking-wider">
                      BY AAYU SOLUTION
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-xl bg-white/10 border border-white/20">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* Center User Avatar & Details */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl">
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-bold py-0.5 text-amber-300">
                    VIP PASS
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">{user.name}</h4>
                  <p className="text-xs font-mono text-amber-300 font-bold">@{user.giftiId}</p>
                  <p className="text-[10px] text-gray-400">📍 {user.city || 'India'}</p>
                </div>
              </div>

              {/* Bottom Invite QR Code & Flip Hint */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
                <div className="text-left">
                  <p className="text-[9px] font-bold text-amber-300 uppercase">Invite QR</p>
                  <p className="text-[9px] text-gray-400">Scan to Connect</p>
                </div>

                {qrCodeUrl && (
                  <div className="p-1 bg-white rounded-lg shadow-md">
                    <img src={qrCodeUrl} alt="QR" className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Flip Hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-amber-300 transition-colors">
                <RotateCw className="w-3 h-3 animate-spin-slow" />
                <span>Tap to Flip ↻</span>
              </div>

            </div>

            {/* BACK SIDE */}
            <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#150728] via-[#0D041A] to-[#040108] border-2 border-amber-400/60 p-6 flex flex-col items-center justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl shadow-amber-500/20 overflow-hidden text-center">
              
              <div className="absolute inset-1 rounded-[22px] border border-rose-500/30 pointer-events-none" />

              <div className="pt-4 space-y-1">
                <div className="text-4xl">👑</div>
                <h3 className="text-sm font-black text-gradient-gold uppercase tracking-widest font-['Outfit']">
                  LIFETIME VIP MEMBER
                </h3>
              </div>

              {/* User Requested Back Message */}
              <div className="space-y-3 px-2">
                <Heart className="w-8 h-8 text-rose-500 mx-auto fill-current animate-pulse" />
                <p className="text-sm sm:text-base font-serif italic text-gray-200 leading-relaxed font-bold">
                  "THANKS FOR BECOMING A MEMBER OF GIFTI FAMILY ❤️"
                </p>
                <p className="text-[11px] text-gray-400">
                  Keep spreading joy, laughter, and heart-touching digital gifts across the world.
                </p>
              </div>

              <div className="w-full pb-2 border-t border-white/10 pt-3">
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  CRAFTED WITH ❤️ BY AAYU SOLUTION
                </p>
                <p className="text-[9px] text-gray-500 font-mono">
                  ID: {user.id}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ACTION BUTTONS: DOWNLOAD & SHARE */}
        <div className="w-full flex items-center justify-center gap-3 pt-2">
          
          {/* Download Button */}
          <button
            onClick={handleDownloadCard}
            disabled={downloading}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Card Saved to Gallery! ✓</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Exporting HD Card...' : 'Download Card (PNG)'}</span>
              </>
            )}
          </button>

          {/* Flip Toggle Button */}
          <button
            onClick={handleFlipCard}
            className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip ↻</span>
          </button>

        </div>

      </div>
    </div>
  );
};
