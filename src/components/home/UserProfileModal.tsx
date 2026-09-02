import React, { useState } from 'react';
import { UserProfile } from '../../types/gift';
import { saveUserSession, clearUserSession } from '../../services/authService';
import { uploadImageToImgBB } from '../../services/imgbbService';
import { firestoreSetDoc } from '../../services/firebase';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  User,
  Camera,
  LogOut,
  MapPin,
  Calendar,
  Phone,
  Shield,
  Save,
  Loader2,
  Sparkles,
  FileText,
} from 'lucide-react';

interface UserProfileModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  onClose,
  onUpdateUser,
  onLogout,
}) => {
  const { language } = useLanguage();
  const { playSparkle } = useAudio();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [stateName, setStateName] = useState(currentUser.state || '');
  const [dob, setDob] = useState(currentUser.dob || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    playSparkle();
    try {
      const url = await uploadImageToImgBB(file);
      setAvatarUrl(url);
    } catch (err) {
      console.warn('Avatar change failed:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    playSparkle();

    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      bio,
      city,
      state: stateName,
      dob,
      avatarUrl,
    };

    await firestoreSetDoc('users', currentUser.id, updatedUser as unknown as Record<string, unknown>);
    saveUserSession(updatedUser);
    onUpdateUser(updatedUser);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0E0B1F] border border-rose-500/30 shadow-2xl text-center space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pt-2">
          <h2 className="text-xl font-black font-['Outfit'] text-white">
            {language === 'hi' ? 'आपकी प्रोफ़ाइल अपडेट करें' : 'Edit Your Profile'}
          </h2>
          <p className="text-xs text-amber-300 font-mono">@{currentUser.giftiId}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5 text-left">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-rose-400 shadow-lg">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-400">Tap photo to update</span>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Bio / Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>About You / Bio (Instagram Style)</span>
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Heart-toucher • Lover of surprises & deep yaari ✨"
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* DOB & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300">Birthday (DOB)</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400">Mobile (100% Private)</label>
              <input
                type="text"
                disabled
                value={currentUser.phone || 'N/A'}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Changes</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              clearUserSession();
              onLogout();
            }}
            className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out of Account</span>
          </button>

        </form>

      </div>
    </div>
  );
};
