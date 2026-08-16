import React from 'react';
import { Mellstroy } from '../types';

interface RouletteCardProps {
  mellstroy: Mellstroy;
  isHighlighted?: boolean;
}

export const RouletteCard: React.FC<RouletteCardProps> = React.memo(
  ({ mellstroy, isHighlighted = false }) => {
    return (
      <div
        className={`relative w-44 sm:w-52 h-64 sm:h-72 shrink-0 rounded-2xl p-2.5 transition-all duration-300 select-none overflow-hidden ${
          isHighlighted
            ? 'bg-gradient-to-b from-amber-500/30 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/40 scale-105 z-20 animate-pulse'
            : 'bg-slate-900/90 border border-slate-800/80 opacity-80 hover:opacity-100'
        }`}
      >
        {isHighlighted && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-amber-500/10 pointer-events-none" />
        )}

        <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-900/80 border border-slate-800/80 mb-2.5 select-none pointer-events-none flex items-center justify-center">
          <img
            src={mellstroy.image}
            alt={mellstroy.name}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.retried) {
                target.dataset.retried = '1';
                // Try alternate path if relative failed
                target.src = target.src.includes('./')
                  ? target.src.replace('./', '/')
                  : `./${mellstroy.image.replace(/^\//, '')}`;
              }
            }}
          />
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

