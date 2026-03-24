
import React, { useState, useEffect } from 'react';
import { X, User, CheckCircle, CreditCard, Banknote, Clock } from 'lucide-react';
import { formatCurrency } from '../constants';
import { BookingDraft, PaymentMethod } from '../types';
import { Button } from './Button';

interface BookingModalProps {
  draft: BookingDraft | null;
  racketPrice: number;
  instructorPrice: number;
  onClose: () => void;
  onConfirm: (rackets: number, instructor: boolean, paymentMethod: PaymentMethod) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  draft, 
  racketPrice,
  instructorPrice,
  onClose, 
  onConfirm 
}) => {
  const [rackets, setRackets] = useState(0);
  const [instructor, setInstructor] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('in_club');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (draft) {
      setInstructor(draft.preselectedExtras?.instructor || false);
      setRackets(0);
      setPaymentMethod('in_club');
    }
  }, [draft]);

  useEffect(() => {
    if (draft) {
      let calc = draft.court.price;
      calc += rackets * racketPrice;
      if (instructor) calc += instructorPrice;
      setTotal(calc);
    }
  }, [draft, rackets, instructor, racketPrice, instructorPrice]);

  if (!draft) return null;

  const formattedDate = new Intl.DateTimeFormat('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(draft.date);

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 transition-colors flex flex-col max-h-[92dvh] border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Prenotazione</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dettagli Campo 90'</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={24} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          {/* Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 mb-6 space-y-4 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formattedDate}</span>
              <div className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-md">
                <Clock size={10} />
                <span>{draft.slot.startTime} - {draft.slot.endTime}</span>
              </div>
            </div>
            <div className="font-black text-lg text-slate-800 dark:text-white tracking-tight">{draft.court.name}</div>
          </div>

          {/* Extras */}
          <div className="space-y-4 mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Servizi Extra</h3>
            
            <div 
              onClick={() => setInstructor(!instructor)}
              className={`
                flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
                ${instructor 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-orange-200'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${instructor ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  <User size={18} />
                </div>
                <div>
                  <div className="font-black text-slate-900 dark:text-white text-xs">Lezione col Maestro</div>
                  <div className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">+{formatCurrency(instructorPrice)}</div>
                </div>
              </div>
              {instructor && <CheckCircle size={20} className="text-orange-500" />}
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="font-black text-slate-900 dark:text-white text-xs">Noleggio Pale</div>
                  <div className="text-[10px] text-slate-400 font-bold">+{formatCurrency(racketPrice)} cad.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                <button 
                  onClick={(e) => { e.stopPropagation(); setRackets(Math.max(0, rackets - 1)); }}
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-white transition-all font-black disabled:opacity-20"
                  disabled={rackets === 0}
                >
                  -
                </button>
                <span className="w-4 text-center font-black text-slate-900 dark:text-white text-sm">{rackets}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setRackets(Math.min(4, rackets + 1)); }}
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-white transition-all font-black"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 shrink-0 pb-safe sm:pb-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Totale</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button fullWidth onClick={() => onConfirm(rackets, instructor, paymentMethod)} className="h-14 rounded-2xl text-lg shadow-xl">
            Conferma
          </Button>
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
             Cancellazione gratuita fino a 24h prima
          </p>
        </div>
      </div>
    </div>
  );
};