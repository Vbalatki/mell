import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mellstroy } from '../types';
import { MELLSTROYS } from '../data/mellstroys';
import { RouletteCard } from './RouletteCard';
import { Sparkles, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RouletteProps {
  targetMellstroy: Mellstroy;
  onFinished: () => void;
}

const TARGET_POSITION_INDEX = 48;
const TOTAL_CARDS = 60;

export const Roulette: React.FC<RouletteProps> = ({ targetMellstroy, onFinished }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);

  const reelCards = useMemo<Mellstroy[]>(() => {
    const list: Mellstroy[] = [];
    for (let i = 0; i < TOTAL_CARDS; i++) {
      list.push(
        i === TARGET_POSITION_INDEX
          ? targetMellstroy
          : MELLSTROYS[Math.floor(Math.random() * MELLSTROYS.length)],
      );
    }
    return list;
  }, [targetMellstroy]);

  useEffect(() => {
    setIsSpinning(false);
    setHasStopped(false);

    const startTimer = setTimeout(() => {
      soundManager.playSpinStart();
      setIsSpinning(true);

      const containerWidth = containerRef.current?.offsetWidth || 800;
      const isMobile = window.innerWidth < 640;
      const cardWidth = isMobile ? 176 : 208;
      const gap = 16;
      const cardPitch = cardWidth + gap;

      const targetCenter = TARGET_POSITION_INDEX * cardPitch + cardWidth / 2;
      const finalTranslate = -(targetCenter - containerWidth / 2);

      if (!trackRef.current) return;

      let lastTickTime = 0;
      let animationFrameId: number;
      const startTime = performance.now();
      const duration = 5500;

      const tickLoop = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentInterval = 50 + Math.pow(progress, 2.5) * 450;

        if (now - lastTickTime > currentInterval && progress < 0.98) {
          soundManager.playTick();
          lastTickTime = now;
        }
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(tickLoop);
        }
      };
      animationFrameId = requestAnimationFrame(tickLoop);

      trackRef.current.style.transition = 'transform 5.5s cubic-bezier(0.1, 0.9, 0.12, 1)';
      trackRef.current.style.transform = `translateX(${finalTranslate}px)`;

      const stopTimer = setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        setIsSpinning(false);
        setHasStopped(true);
        soundManager.playWinnerFanfare();

        const finishTimer = setTimeout(() => onFinished(), 1200);
        return () => clearTimeout(finishTimer);
      }, 5600);

      return () => {
        clearTimeout(stopTimer);
        cancelAnimationFrame(animationFrameId);
      };
    }, 400);

    return () => clearTimeout(startTimer);
  }, [reelCards, onFinished]);

  return (
    <div
      id="roulette-screen"
      className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>СИНХРОНИЗАЦИЯ С ДАТОЙ РОЖДЕНИЯ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          КАКОЙ ТЫ МЕЛЛСТРОЙ?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          {isSpinning ? 'Рулетка определяет твой результат...' : hasStopped ? 'Результат найден!' : 'Запуск барабана...'}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-5xl rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent z-30 pointer-events-none" />

        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>

        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-400 via-rose-500 to-amber-400 shadow-[0_0_15px_#fbbf24] z-20 pointer-events-none opacity-80" />

        <div className="py-4 overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-4 will-change-transform"
            style={{ transform: 'translateX(0px)' }}
          >
            {reelCards.map((card, idx) => {
              const isTarget = idx === TARGET_POSITION_INDEX;
              return (
                <RouletteCard
                  key={`${card.id}-${idx}`}
                  mellstroy={card}
                  isHighlighted={hasStopped && isTarget}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-semibold">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Случайный подбор уникального Меллстроя</span>
      </div>
    </div>
  );
};
