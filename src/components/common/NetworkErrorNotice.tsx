import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Sparkles } from 'lucide-react';

interface NetworkErrorNoticeProps {
  onRetry?: () => void;
}

export const NetworkErrorNotice: React.FC<NetworkErrorNoticeProps> = ({ onRetry }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-3.5 rounded-2xl bg-red-950/90 border border-red-500/50 shadow-2xl backdrop-blur-xl text-white flex items-center justify-between gap-3 animate-slide-down">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
          <WifiOff className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-left">
          <h4 className="text-xs font-bold text-red-200 leading-tight">
            Network Connection Lost
          </h4>
          <p className="text-[10px] text-gray-300">
            Checking your internet... Please reconnect.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (onRetry) onRetry();
          else window.location.reload();
        }}
        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-bold text-xs flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry</span>
      </button>
    </div>
  );
};
