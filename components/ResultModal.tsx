
import React, { useState } from 'react';
import { X, Trophy, Frown, Save } from 'lucide-react';
import { Button } from './Button';
import { MatchOutcome } from '../types';

interface ResultModalProps {
  onClose: () => void;
  onSave: (score: string, outcome: MatchOutcome) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ onClose, onSave }) => {
  const [score, setScore] = useState('');
  const [outcome, setOutcome] = useState<MatchOutcome | null>(null);

  const handleSave = () => {
    if (score && outcome) {
      onSave(score, outcome);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Com'è andata?</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Outcome Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOutcome('won')}
              className={`
                p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                ${outcome === 'won' 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800 text-slate-600 dark:text-slate-400'}
              `}
            >
              <Trophy size={32} className={outcome === 'won' ? 'text-orange-500' : 'opacity-50'} />
              <span className="font-bold">Vittoria</span>
            </button>

            <button
              onClick={() => setOutcome('lost')}
              className={`
                p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                ${outcome === 'lost' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ring-2 ring-red-500/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 text-slate-600 dark:text-slate-400'}
              `}
            >
              <Frown size={32} className={outcome === 'lost' ? 'text-red-500' : 'opacity-50'} />
              <span className="font-bold">Sconfitta</span>
            </button>
          </div>

          {/* Score Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Punteggio (Set)</label>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Es. 6-4 6-2"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Inserisci i risultati dei set separati da spazio.</p>
          </div>

          <Button 
            fullWidth 
            onClick={handleSave} 
            disabled={!score || !outcome}
          >
            <div className="flex items-center justify-center gap-2">
              <Save size={18} />
              <span>Registra Partita</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
