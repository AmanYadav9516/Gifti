import React, { useState } from 'react';
import { UserProfile } from '../../types/gift';
import { firestoreSetDoc } from '../../services/firebase';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Star,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  currentUser: UserProfile;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ currentUser, onClose }) => {
  const { language } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    playSparkle();

    try {
      const feedbackId = 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      await firestoreSetDoc('feedback_submissions', feedbackId, {
        id: feedbackId,
        userId: currentUser.id,
        userName: currentUser.name,
        giftiId: currentUser.giftiId,
        rating,
        feedback: feedback.trim(),
        createdAt: Date.now(),
      });

      playUnbox();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF4D6D', '#38BDF8'],
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.warn('Feedback submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in text-white">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0E0B1F] border border-amber-400/40 shadow-2xl text-center space-y-4 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 space-y-3 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-black text-white font-['Outfit']">
              Thank You For Your Love! ❤️
            </h3>
            <p className="text-xs text-gray-300">
              Your valuable feedback has been submitted to AAYU SOLUTION team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            
            <div className="space-y-1 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gifti Experience & Rating</span>
              </div>
              <h3 className="text-xl font-black font-['Outfit'] text-white">
                How Was Your Experience? ✨
              </h3>
              <p className="text-xs text-gray-400">
                Rate us and help us make Gifti even more magical for you!
              </p>
            </div>

            {/* Interactive 5-Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    playSparkle();
                    setRating(star);
                  }}
                  className="p-1 hover:scale-125 active:scale-95 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback Input */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-gray-300">
                Your Thoughts & Suggestions:
              </label>
              <textarea
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you love or what new features you want in Gifti..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !feedback.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Submitting Feedback...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>Submit Rating & Review ✨</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
