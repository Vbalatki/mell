import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Sparkles, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PaymentSuccessProps {
  isProcessing: boolean;
  onComplete: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  isProcessing,
  onComplete,
}) => {
  useEffect(() => {
    if (!isProcessing) {
      soundManager.playSuccess();
      const timer = setTimeout(() => {
        onComplete();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, onComplete]);

  return (
    <div
      id="payment-success-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {isProcessing ? (
          /* Processing State */
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white">Обработка платежа...</h3>
            <p className="text-xs text-slate-400">
              Проверяем транзакцию и запускаем рулетку...
            </p>
          </div>
        ) : (
          /* Success State */
          <div className="py-6 space-y-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] mx-auto shadow-xl shadow-emerald-500/25"
            >
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ПЛАТЁЖ ПОДТВЕРЖДЁН</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                ОПЛАТА ПРОШЛА УСПЕШНО!
              </h2>
              <p className="text-sm sm:text-base font-semibold text-amber-300 mt-2 flex items-center justify-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Теперь определяем твоего Меллстроя...</span>
              </p>
            </div>

            {/* Micro loading bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
