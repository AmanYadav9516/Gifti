import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { AudioWaveform } from '../common/AudioWaveform';

interface VoiceRecorderProps {
  voiceNoteUrl?: string;
  onSaveVoiceNote: (url?: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ voiceNoteUrl, onSaveVoiceNote }) => {
  const { t } = useLanguage();
  const { playSparkle } = useAudio();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onSaveVoiceNote(base64Audio);
          playSparkle();
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Please allow microphone access to record your sweet voice note!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayPreview = () => {
    if (!voiceNoteUrl) return;

    if (isPlaying) {
      audioPlayerRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(voiceNoteUrl);
        audioPlayerRef.current.onended = () => setIsPlaying(false);
      } else {
        audioPlayerRef.current.src = voiceNoteUrl;
      }
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDelete = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    onSaveVoiceNote(undefined);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
          <Mic className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.stepVoice}
          </h3>
          <p className="text-xs text-gray-400 leading-snug">
            {t.voiceNoteDesc}
          </p>
        </div>
      </div>

      {!voiceNoteUrl ? (
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/30 border border-white/10 text-center gap-3">
          {isRecording ? (
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-pulse">
                <Mic className="w-7 h-7 text-rose-400" />
              </div>
              <AudioWaveform isPlaying={true} color="bg-rose-400" />
              <span className="text-sm font-bold text-rose-400">
                00:{duration < 10 ? `0${duration}` : duration} / 00:30
              </span>
              <button
                type="button"
                onClick={stopRecording}
                className="px-5 py-2 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t.recordStop}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{t.recordStart}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayPreview}
              className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-rose-400" />
                <span>Voice Note Attached</span>
              </span>
              <AudioWaveform isPlaying={isPlaying} color="bg-rose-400" barCount={12} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors"
            title={t.recordDelete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
