import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mellstroy } from '../types';
import { formatRussianDate } from '../utils/calculateResult';
import { Sparkles, RotateCcw, Share2, Trophy, Check, Volume2, VolumeX, Play } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ResultScreenProps {
  mellstroy: Mellstroy;
  birthday?: string;
  onTryAgain: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  mellstroy,
  birthday,
  onTryAgain,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoError(false);
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay policy fallback: guarantee playback by forcing muted
        video.muted = true;
        setIsMuted(true);
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });
  }, [mellstroy.id]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleShare = () => {
    soundManager.playClick();
    const shareText = `🔥 Мой результат: «${mellstroy.name}»!\nУзнай своего Меллстроя по дате рождения!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      id="result-screen"
      className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-xl text-center"
      >
        {/* Top Result Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Твой результат по дате рождения</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        {/* Big Clean Result Announcement */}
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
          ТЫ — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">
            {mellstroy.name}
          </span>
        </h1>

        {birthday && (
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mb-6">
            Дата рождения: <span className="text-white">{formatRussianDate(birthday)}</span>
          </p>
        )}

        {/* Clean Showcase Card with Video as Central Focus */}
        <div className="relative rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl text-center overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600" />

          {/* Video Container - Pure Instant Autoplay with Sound */}
          <div
            onClick={togglePlayPause}
            className="relative w-full aspect-[4/5] sm:aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl select-none group cursor-pointer"
          >
            {mellstroy.video && !videoError ? (
              <>
                <video
                  ref={videoRef}
                  src={mellstroy.video}
                  poster={mellstroy.image}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controls={false}
                  onError={() => setVideoError(true)}
                  onPlaying={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover object-center"
                />

                {/* Big play button if paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 backdrop-blur-md">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Sound toggle button in corner */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-lg flex items-center gap-1.5 text-xs font-bold cursor-pointer z-30"
                  title={isMuted ? 'Включить звук' : 'Выключить звук'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span className="text-[11px] text-slate-200">ВКЛ ЗВУК</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-[11px] text-amber-300">ЗВУК ВКЛ</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <img
                src={mellstroy.image}
                alt={mellstroy.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.retried) {
                    target.dataset.retried = '1';
                    target.src = target.src.includes('./')
                      ? target.src.replace('./', '/')
                      : `./${mellstroy.image.replace(/^\//, '')}`;
                  }
                }}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800/90 flex flex-col sm:flex-row gap-3">
            <button
              id="try-again-button"
              onClick={() => {
                soundManager.playClick();
                onTryAgain();
              }}
              className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              <span>ПОПРОБОВАТЬ ЕЩЁ РАЗ</span>
            </button>

            <button
              id="share-result-button"
              onClick={handleShare}
              className="h-14 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">СКОПИРОВАНО!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>ПОДЕЛИТЬСЯ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


