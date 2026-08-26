import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onPhotosChange }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let w = img.width;
          let h = img.height;
          if (w > h && w > maxDim) {
            h = (h * maxDim) / w;
            w = maxDim;
          } else if (h > maxDim) {
            w = (w * maxDim) / h;
            h = maxDim;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playSparkle();
    const newPhotos: string[] = [...photos];
    for (let i = 0; i < files.length; i++) {
      if (newPhotos.length >= 5) break;
      const compressed = await compressImage(files[i]);
      newPhotos.push(compressed);
    }
    onPhotosChange(newPhotos);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.stepPhotos}
            </h3>
            <p className="text-xs text-gray-400 leading-snug">
              {t.photosDesc}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
          {photos.length}/5
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
        {photos.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-md">
            <img src={img} alt={`Memory ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemovePhoto(idx)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {photos.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-rose-400/60 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white transition-all hover:scale-105"
          >
            <Plus className="w-6 h-6 text-rose-400" />
            <span className="text-[10px] font-bold">Add Photo</span>
          </button>
        )}
      </div>
    </div>
  );
};
