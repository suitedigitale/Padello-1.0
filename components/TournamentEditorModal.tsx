
import React, { useState, useEffect } from 'react';
import { X, Save, Trophy, Calendar, Users, TrendingUp, Shield } from 'lucide-react';
import { Button } from './Button';
import { Tournament } from '../types';
import { getLevelDescription } from '../constants';

interface TournamentEditorModalProps {
  tournament?: Tournament; 
  clubId: string;
  onClose: () => void;
  onSave: (tournamentData: any) => void;
}

export const TournamentEditorModal: React.FC<TournamentEditorModalProps> = ({ tournament, clubId, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [maxTeams, setMaxTeams] = useState<number>(8);
  const [minRating, setMinRating] = useState<number>(1.00);
  const [maxRating, setMaxRating] = useState<number>(7.00);
  const [prize, setPrize] = useState('');

  useEffect(() => {
    if (tournament) {
      setName(tournament.name);
      setStartDate(tournament.startDate);
      setMaxTeams(tournament.maxTeams);
      setMinRating(tournament.minRating || 1.00);
      setMaxRating(tournament.maxRating || 7.00);
      setPrize(tournament.prize || '');
    }
  }, [tournament]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;

    onSave({
      id: tournament?.id,
      clubId,
      name,
      startDate,
      format: 'knockout',
      maxTeams,
      minRating,
      maxRating,
      prize
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tighter">
              <Trophy size={24} className="text-orange-500" />
              {tournament ? 'Edita Torneo' : 'Nuova Arena'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Impostazioni Competizione</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Torneo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Slam Estivo Milano" className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Inizio</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl py-4 px-5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm" required />
          </div>

          <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <TrendingUp size={16} className="text-indigo-500" />Range Livello Ammesso
            </label>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-black uppercase text-center block">Min</span>
                  <input type="number" step="0.1" min="1.0" max="7.0" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full bg-white dark:bg-slate-800 border rounded-xl px-3 py-3 text-center font-mono font-black shadow-sm" />
                  <div className="text-[8px] font-black text-orange-500 uppercase text-center mt-1 truncate">{getLevelDescription(minRating)}</div>
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-black uppercase text-center block">Max</span>
                  <input type="number" step="0.1" min="1.0" max="7.0" value={maxRating} onChange={(e) => setMaxRating(Number(e.target.value))} className="w-full bg-white dark:bg-slate-800 border rounded-xl px-3 py-3 text-center font-mono font-black shadow-sm" />
                  <div className="text-[8px] font-black text-indigo-500 uppercase text-center mt-1 truncate">{getLevelDescription(maxRating)}</div>
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partecipanti Max</label>
            <div className="grid grid-cols-3 gap-3">
              {[4, 8, 16].map(num => (
                <button key={num} type="button" onClick={() => setMaxTeams(num)} className={`py-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${maxTeams === num ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                  <Users size={18} /><span className="font-black text-[10px] uppercase">{num} Sq.</span>
                </button>
              ))}
            </div>
          </div>
          
          <Button type="submit" fullWidth className="h-16 rounded-2xl text-lg shadow-2xl shadow-orange-500/20 active:scale-95">
             <Save size={24} className="mr-2" /> <span className="font-black uppercase tracking-widest">Crea Arena</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
