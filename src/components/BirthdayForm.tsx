import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Sparkles, Flame, ArrowRight, Zap, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BirthdayFormProps {
  birthday: string;
  onBirthdayChange: (date: string) => void;
  onSubmit: () => void;
}

export const BirthdayForm: React.FC<BirthdayFormProps> = ({
  birthday,
  onBirthdayChange,
  onSubmit,
}) => {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) {
      setError('Пожалуйста, выберите дату рождения');
      return;
    }
    setError('');
    soundManager.playClick();
    onSubmit();
  };

  const handleQuickDate = (dateStr: string) => {
    soundManager.playClick();
    onBirthdayChange(dateStr);
    setError('');
  };

  return (
    <div id="birthday-screen" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-xl text-center"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-lg shadow-amber-500/10">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Уникальные вариации Меллстроя</span>
          <Star className="w-4 h-4 text-amber-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
          КАКОЙ ТЫ <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 drop-shadow-sm">
            МЕЛЛСТРОЙ?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 font-medium mb-10 max-w-md mx-auto leading-relaxed">
          Узнай своего Меллстроя по дате рождения
        </p>

        {/* Form Container */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-left overflow-hidden">
          {/* Top glowing line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="birthday-input"
                className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span>Дата рождения</span>
              </label>

              <div className="relative">
                <input
                  id="birthday-input"
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    onBirthdayChange(e.target.value);
                    if (error) setError('');
                  }}
                  min="1940-01-01"
                  max="2026-12-31"
                  className="w-full h-14 px-4 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-white text-base font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer placeholder-slate-500"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            {/* Quick date presets */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Быстрый выбор для теста:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '15.12.1998 (Меллстрой)', val: '1998-12-15' },
                  { label: '01.01.2000', val: '2000-01-01' },
                  { label: '17.07.2003', val: '2003-07-17' },
                  { label: 'Сегодня', val: new Date().toISOString().split('T')[0] }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleQuickDate(item.val)}
                    className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Action Button */}
            <button
              id="submit-birthday-btn"
              type="submit"
              className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <div className="w-full h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-[14px] flex items-center justify-center gap-3 text-slate-950 font-black text-base sm:text-lg tracking-wider group-hover:brightness-110 transition-all">
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>УЗНАТЬ МОЕГО МЕЛЛСТРОЯ</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          {/* Micro Footer Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Каждая дата рождения выдаёт строго закрепленный результат</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
