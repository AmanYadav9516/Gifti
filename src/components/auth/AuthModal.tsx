import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/gift';
import { registerUserProfile, loginWithGiftiIdOrPhone, checkGiftiIdAvailability } from '../../services/authService';
import { uploadImageToImgBB } from '../../services/imgbbService';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  Sparkles,
  User,
  Calendar,
  Phone,
  MapPin,
  Camera,
  AtSign,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [giftiId, setGiftiId] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [checkingId, setCheckingId] = useState(false);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Login Field
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Real-time unique Gifti ID check
  useEffect(() => {
    if (mode !== 'signup' || giftiId.length < 3) {
      setIsIdAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingId(true);
      const available = await checkGiftiIdAvailability(giftiId);
      setIsIdAvailable(available);
      setCheckingId(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [giftiId, mode]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    playSparkle();
    try {
      const url = await uploadImageToImgBB(file);
      setAvatarUrl(url);
      playSparkle();
    } catch (err) {
      console.warn('Avatar upload fallback:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (giftiId.length < 3) {
      setErrorMsg(language === 'hi' ? 'Gifti ID कम से कम 3 अक्षरों की होनी चाहिए।' : 'Gifti ID must be at least 3 characters.');
      return;
    }

    if (isIdAvailable === false) {
      setErrorMsg(language === 'hi' ? 'यह Gifti ID पहले से ली जा चुकी है, कृपया दूसरी चुनें।' : 'This Gifti ID is already taken. Please choose another.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerUserProfile({
        name,
        giftiId,
        dob,
        gender,
        phone,
        city,
        district,
        state: stateName,
        country,
        avatarUrl,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#FFD700', '#C77DFF', '#38BDF8'],
      });
      playUnbox();
      onSuccess(user);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Registration failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await loginWithGiftiIdOrPhone(loginIdentifier);
      if (user) {
        playUnbox();
        onSuccess(user);
      } else {
        setErrorMsg(language === 'hi' ? 'कोई खाता नहीं मिला। कृपया अपनी ID या नंबर जांचें।' : 'No account found. Please check your Gifti ID or Mobile number.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 p-6 sm:p-7 rounded-3xl bg-[#0E0B1F] border border-rose-500/30 shadow-2xl shadow-rose-500/20 text-white space-y-5">
        
        {/* Glow Halo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-lg">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {mode === 'signup' ? 'Join the Gifti Family ✨' : 'Welcome Back! ❤️'}
          </h2>
          <p className="text-xs text-gray-300">
            {mode === 'signup'
              ? (language === 'hi' ? 'अपनी अनूठी Gifti ID बनाएं और दोस्तों से जुड़ें' : 'Create your unique Gifti ID and connect with loved ones')
              : (language === 'hi' ? 'अपनी Gifti ID या फोन नंबर से लॉगिन करें' : 'Login using your Gifti ID or Mobile Number')}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              playSparkle();
              setMode('signup');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नया खाता बनाएं (Sign Up)' : 'Create Account (Sign Up)'}
          </button>
          <button
            type="button"
            onClick={() => {
              playSparkle();
              setMode('login');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'लॉगिन करें (Login)' : 'Sign In (Login)'}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignUpSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center gap-2 py-1">
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-rose-400/80 shadow-lg">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {language === 'hi' ? 'प्रोफाइल फोटो बदलें (ImgBB HD)' : 'Tap photo to upload avatar'}
              </span>
            </div>

            {/* 1. Full Name & Gifti ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Yadav"
                  className="w-full px-3.5 py-2 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unique GIFTI ID</span>
                  </span>
                  {checkingId ? (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> checking...
                    </span>
                  ) : isIdAvailable === true ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Available ✓
                    </span>
                  ) : isIdAvailable === false ? (
                    <span className="text-[10px] font-bold text-red-400">
                      Already Taken ✗
                    </span>
                  ) : null}
                </label>
                <input
                  type="text"
                  required
                  value={giftiId}
                  onChange={(e) => setGiftiId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="e.g. aman_gifts"
                  className={`w-full px-3.5 py-2 rounded-2xl bg-black/50 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                    isIdAvailable === true ? 'border-emerald-500' : isIdAvailable === false ? 'border-red-500' : 'border-white/15 focus:border-rose-400'
                  }`}
                />
              </div>
            </div>

            {/* 2. Date of Birth (DOB) & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'जन्म तिथि (DOB for Birthday Wishes)' : 'Date of Birth (For Birthday Celebrations)'}</span>
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">
                  {language === 'hi' ? 'लिंग / Gender' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="male">Male (पुरुष)</option>
                  <option value="female">Female (महिला)</option>
                  <option value="other">Other (अन्य)</option>
                </select>
              </div>
            </div>

            {/* 3. Mobile Number with User's Exact Requested Privacy Notice */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-black/30 border border-white/10">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
              />
              {/* User's Exact Requested Privacy Reassurance */}
              <div className="flex items-start gap-1.5 pt-1 text-[11px] text-amber-300/90 font-medium leading-tight">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'hi'
                    ? 'चिंता न करें! आपका मोबाइल नंबर किसी अन्य यूज़र को दिखाई नहीं देगा, केवल आपकी GIFTI ID दिखेगी।'
                    : "DON'T WORRY: Your mobile number is not visible to other users. Only your GIFTI ID is shown."}
                </span>
              </div>
            </div>

            {/* 4. Location (City, District, State, Country) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">State</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="State"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isIdAvailable === false}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-rose-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Your Gifti Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'hi' ? 'प्रोफ़ाइल बनाएं व शुरू करें ✨' : 'Complete Profile & Enter ✨'}</span>
                </>
              )}
            </button>

          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'hi' ? 'आपकी GIFTI ID या मोबाइल नंबर' : 'Your GIFTI ID or Mobile Number'}</span>
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. aman_gifts or 9876543210"
                className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{language === 'hi' ? 'लॉगिन करें ✨' : 'Sign In to Gifti ✨'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
