import React, { useState } from 'react';
import { X, Save, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface RatingModalProps {
  currentRating: number;
  onClose: () => void;
  onSave: (newRating: number) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ currentRating, onClose, onSave }) => {
  const [rating, setRating] = useState(currentRating);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Modifica Rating
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nuovo Punteggio</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center font-mono text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <Button fullWidth onClick={() => onSave(rating)}>
            <div className="flex items-center justify-center gap-2">
              <Save size={18} />
              <span>Salva</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};