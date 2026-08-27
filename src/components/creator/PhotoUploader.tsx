import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, Plus, Sparkles, Loader2, CloudUpload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { uploadImageToImgBB } from '../../services/imgbbService';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onPhotosChange }) => {
  const { t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    playSparkle();

    const newPhotos: string[] = [...photos];
    const totalFiles = Math.min(files.length, 5 - photos.length);

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      setUploadProgress(`${i + 1}/${totalFiles}`);
      try {
        const uploadedUrl = await uploadImageToImgBB(file);
        newPhotos.push(uploadedUrl);
      } catch (err) {
        console.warn('ImgBB upload failed, falling back to local compressed:', err);
        // Local compression fallback if network fails
        const localUrl = await getLocalCompressedUrl(file);
        newPhotos.push(localUrl);
      }
    }

    onPhotosChange(newPhotos);
    setIsUploading(false);
    setUploadProgress('');
    playUnbox();

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getLocalCompressedUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 450;
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
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5 shadow-xl">
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

      {isUploading && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-400/30 flex items-center justify-center gap-2.5 animate-pulse">
          <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
          <span className="text-xs font-bold text-rose-200">
            {t.uploadingToCloud} {uploadProgress && `(${uploadProgress})`}
          </span>
        </div>
      )}

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
            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow">
              <CloudUpload className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}

        {photos.length < 5 && !isUploading && (
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
