import React from 'react';
import { Mellstroy } from '../types';

interface RouletteCardProps {
  mellstroy: Mellstroy;
  isHighlighted?: boolean;
  playVideo?: boolean; // true только для выигрышной карточки после остановки барабана
}

export const RouletteCard: React.FC<RouletteCardProps> = React.memo(
  ({ mellstroy, isHighlighted = false, playVideo = false }) => {
    return (
      <div
        className={`relative w-44 sm:w-52 h-64 sm:h-72 shrink-0 rounded-2xl p-2.5 transition-all duration-300 select-none overflow-hidden ${
          isHighlighted
            ? 'bg-gradient-to-b from-amber-500/30 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/40 scale-105 z-20'
            : 'bg-slate-900/90 border border-slate-800/80 opacity-80 hover:opacity-100'
        }`}
      >
        {isHighlighted && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-amber-500/10 pointer-events-none" />
        )}

        <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-2.5 select-none pointer-events-none">
          {playVideo && mellstroy.video ? (
            <video
              src={mellstroy.video}
              poster={mellstroy.image}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controls={false}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <img
              src={mellstroy.image}
              alt={mellstroy.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        <div className="text-center px-1">
          <h4 className="text-xs sm:text-sm font-black text-white truncate leading-snug">
            {mellstroy.name}
          </h4>
        </div>
      </div>
    );
  },
);

RouletteCard.displayName = 'RouletteCard';
