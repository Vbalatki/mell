import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Lock, Sparkles, CheckCircle2, AlertTriangle, Wand2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPayment: () => void;
  isProcessing: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmitPayment,
  isProcessing,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setExpiry(val);
  };

  const handleFormatCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(val);
  };

  const handleAutoFill = () => {
    soundManager.playClick();
    setCardNumber('4400 8822 9911 3377');
    setExpiry('12/28');
    setCvv('777');
    setHolderName('MELLSTROY VIP');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onSubmitPayment();
  };

  return (
    <AnimatePresence>
      <div
        id="payment-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          id="payment-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-2xl my-auto text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top gradient glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600" />

          {/* Close button */}
          <button
            id="close-payment-modal"
            onClick={() => {
              if (!isProcessing) {
                soundManager.playClick();
                onClose();
              }
            }}
            disabled={isProcessing}
            aria-label="Закрыть"
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Section */}
          <div className="mb-6 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>БЕЗОПАСНАЯ ОПЛАТА</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Для получения результата необходимо оплатить доступ
            </h2>
            <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs text-slate-300 font-medium">Стоимость доступа:</span>
              <span className="text-lg font-black text-amber-400">67 ₽</span>
            </div>
          </div>

          {/* Visual Interactive Credit Card */}
          <div className="perspective-1000 mb-6">
            <div
              className={`relative w-full h-44 sm:h-48 rounded-2xl p-5 text-white transition-transform duration-500 transform-style-preserve-3d shadow-xl ${
                isFlipped ? 'rotate-y-180' : ''
              } bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-700 border border-white/20`}
            >
              {!isFlipped ? (
                /* Card Front */
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-7 rounded bg-amber-200/40 border border-amber-200/50 backdrop-blur-sm" />
                      <span className="text-[11px] font-mono tracking-widest text-amber-200 uppercase font-bold">
                        MELLSTROY CARD
                      </span>
                    </div>
                    <CreditCard className="w-6 h-6 text-white/80" />
                  </div>

                  <div className="text-lg sm:text-xl font-mono tracking-widest font-bold drop-shadow">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono uppercase">
                    <div>
                      <span className="text-[9px] text-white/60 block">Держатель</span>
                      <span className="font-bold tracking-wider truncate max-w-[170px] block">
                        {holderName || 'MELLSTROY VIP'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-white/60 block">Срок</span>
                      <span className="font-bold tracking-wider">{expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Back */
                <div className="w-full h-full flex flex-col justify-between rotate-y-180">
                  <div className="h-8 bg-slate-950/80 -mx-5 mt-2" />
                  <div className="text-right px-4">
                    <span className="text-[9px] text-white/70 block uppercase">CVV / CVC</span>
                    <div className="bg-white/20 px-3 py-1 rounded text-right font-mono font-bold tracking-widest">
                      {cvv || '•••'}
                    </div>
                  </div>
                  <div className="text-[9px] text-white/60 text-center font-mono">
                    SECURE PAYMENT GATEWAY
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick AutoFill Button */}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Быстрое заполнение</span>
            </button>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Номер карты
              </label>
              <input
                id="card-number-input"
                type="text"
                value={cardNumber}
                onChange={handleFormatCardNumber}
                onFocus={() => setIsFlipped(false)}
                placeholder="0000 0000 0000 0000"
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Срок действия
                </label>
                <input
                  id="card-expiry-input"
                  type="text"
                  value={expiry}
                  onChange={handleFormatExpiry}
                  onFocus={() => setIsFlipped(false)}
                  placeholder="MM/YY"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  CVV
                </label>
                <input
                  id="card-cvv-input"
                  type="password"
                  value={cvv}
                  onChange={handleFormatCvv}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  placeholder="123"
                  maxLength={3}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Имя держателя карты
              </label>
              <input
                id="card-holder-input"
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                onFocus={() => setIsFlipped(false)}
                placeholder="IVAN IVANOV"
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 uppercase focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              id="pay-button"
              type="submit"
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-base tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>ОПЛАТИТЬ 67 ₽</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
