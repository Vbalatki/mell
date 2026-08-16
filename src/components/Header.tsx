import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          id="logo-button"
          onClick={() => {
            soundManager.playClick();
            onReset();
          }}
          className="flex items-center gap-3 group text-left cursor-pointer transition-transform active:scale-95"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              КАКОЙ ТЫ МЕЛЛСТРОЙ?
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </span>
            <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
              Шуточный астрологический мем-сервис
            </p>
          </div>
        </button>

        {/* Right Action: Sound Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="sound-toggle-button"
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold cursor-pointer active:scale-95"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline text-slate-400">Звук: выкл</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-slate-300">Звук: вкл</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
