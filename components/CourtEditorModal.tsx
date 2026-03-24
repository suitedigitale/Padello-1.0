
import React, { useState, useEffect } from 'react';
import { X, Save, Sun, Cloud } from 'lucide-react';
import { Button } from './Button';
import { Court, CourtType } from '../types';

interface CourtEditorModalProps {
  court?: Court; // If undefined, we are adding a new court
  clubId: string;
  onClose: () => void;
  onSave: (courtData: Omit<Court, 'id'> & { id?: number }) => void;
}

export const CourtEditorModal: React.FC<CourtEditorModalProps> = ({ court, clubId, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<CourtType>('indoor');
  const [price, setPrice] = useState(14);

  useEffect(() => {
    if (court) {
      setName(court.name);
      setType(court.type);
      setPrice(court.price);
    }
  }, [court]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    onSave({
      id: court?.id,
      clubId,
      name,
      type,
      price
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {court ? 'Modifica Campo' : 'Aggiungi Campo'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Nome Campo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Campo 4"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Tipologia</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('indoor')}
                className={`
                  p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all
                  ${type === 'indoor' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 text-slate-500'}
                `}
              >
                <Cloud size={18} />
                <span className="font-bold text-sm">Indoor</span>
              </button>
              <button
                type="button"
                onClick={() => setType('outdoor')}
                className={`
                  p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all
                  ${type === 'outdoor' 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-orange-200 text-slate-500'}
                `}
              >
                <Sun size={18} />
                <span className="font-bold text-sm">Outdoor</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Prezzo Base (€/90min)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="1"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          <Button type="submit" fullWidth className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <Save size={18} />
              <span>{court ? 'Salva Modifiche' : 'Crea Campo'}</span>
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};
