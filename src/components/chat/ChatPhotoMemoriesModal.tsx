import React, { useState } from 'react';
import { uploadImageToImgBB } from '../../services/imgbbService';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Camera,
  UploadCloud,
  Loader2,
  Sparkles,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Send,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatPhotoMemoriesModalProps {
  onClose: () => void;
  onSendPhotos: (photos: string[]) => Promise<void>;
  viewOnlyPhotos?: string[];
}

export const ChatPhotoMemoriesModal: React.FC<ChatPhotoMemoriesModalProps> = ({
  onClose,
  onSendPhotos,
  viewOnlyPhotos,
}) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(viewOnlyPhotos || []);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isViewOnly = !!viewOnlyPhotos && viewOnlyPhotos.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    playSparkle();
    const newFiles = [...selectedFiles, ...files].slice(0, 10);
    setSelectedFiles(newFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleUploadAndSend = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    playSparkle();

    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadImageToImgBB(file);
        uploadedUrls.push(url);
      }

      await onSendPhotos(uploadedUrls);
      playUnbox();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#FFD700', '#38BDF8'],
      });
      onClose();
    } catch (err) {
      console.warn('Memory upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-[#0E0B1F] border border-rose-500/40 shadow-2xl space-y-4 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>3D Flying Chat Memories</span>
          </div>
          <h3 className="text-xl font-black font-['Outfit'] text-white">
            {isViewOnly ? 'Shared Memory Moments 📸' : 'Share Up to 10 Memory Photos ✨'}
          </h3>
          <p className="text-xs text-gray-400">
            {isViewOnly
              ? 'Photos automatically vanish in 24 hours to keep chat clean.'
              : 'Photos will fly in 3D air with relaxing chimes and vanish in 24 hours.'}
          </p>
        </div>

        {/* VIEW-ONLY 3D FLYING SLIDESHOW */}
        {isViewOnly ? (
          <div className="space-y-4 py-2">
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl animate-float">
              <img
                src={previews[currentIndex]}
                alt="Memory"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-xs font-bold text-amber-300 border border-amber-400/40">
                {currentIndex + 1} / {previews.length}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2">
              {previews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Direct Download Button */}
            <a
              href={previews[currentIndex]}
              download={`Gifti_Memory_${currentIndex + 1}.jpg`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Current Photo</span>
            </a>
          </div>
        ) : (
          /* PHOTO PICKER & PREVIEWS */
          <div className="space-y-4">
            {previews.length === 0 ? (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-rose-500/40 rounded-3xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all p-4 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">
                  Tap to Select up to 10 Photos
                </span>
                <span className="text-[11px] text-gray-400">
                  Supports JPG, PNG, WEBP
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                  {previews.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-full h-16 rounded-xl overflow-hidden border border-white/20 group"
                    >
                      <img src={url} alt="Thumb" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {previews.length < 10 && (
                    <label className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/20 bg-white/5 cursor-pointer hover:bg-white/10">
                      <Camera className="w-4 h-4 text-gray-400" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>{previews.length} of 10 photos selected</span>
                  <span className="text-amber-300 font-semibold">24h Auto-Clean ✓</span>
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleUploadAndSend}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading & Casting 3D VFX...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send 3D Flying Memories 📸</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
