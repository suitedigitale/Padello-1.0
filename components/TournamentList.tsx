
import React, { useState, useMemo } from 'react';
import { Tournament, Club, User } from '../types';
import { Trophy, Calendar, Users, ChevronRight, Medal, ArrowLeft, Filter, ShieldCheck, Star, MapPin } from 'lucide-react';

interface TournamentListProps {
  tournaments: Tournament[];
  clubs: Club[];
  user: User;
  onSelect: (tournament: Tournament) => void;
  onBack: () => void;
}

export const TournamentList: React.FC<TournamentListProps> = ({ tournaments, clubs, user, onSelect, onBack }) => {
  const [showCompatibleOnly, setShowCompatibleOnly] = useState(false);

  const filteredTournaments = useMemo(() => {
    if (!showCompatibleOnly) return tournaments;
    return tournaments.filter(t => 
      user.rating >= (t.minRating || 1.0) && 
      user.rating <= (t.maxRating || 7.0)
    );
  }, [tournaments, showCompatibleOnly, user.rating]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
       <div className="sticky top-20 bg-slate-50 dark:bg-slate-950 pt-2 pb-6 z-[90] transition-colors duration-200 mb-4">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack} 
            className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tornei Disponibili</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Arena dei Campioni</p>
          </div>
        </div>

        <button 
          onClick={() => setShowCompatibleOnly(!showCompatibleOnly)}
          className={`flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
            showCompatibleOnly 
              ? 'bg-orange-500 text-white border-orange-600 shadow-xl shadow-orange-500/20' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
          }`}
        >
          <Filter size={18} />
          <span>{showCompatibleOnly ? 'Mostra Tutto il Regno' : 'Filtra per mio Livello'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold px-12 text-lg">
              {showCompatibleOnly 
                ? 'Nessun torneo compatibile con il tuo rating attuale.' 
                : 'Nessuna competizione in programma al momento.'}
            </p>
          </div>
        ) : (
          filteredTournaments.map(tournament => {
            const club = clubs.find(c => c.id === tournament.clubId);
            const isCompatible = user.rating >= (tournament.minRating || 1.0) && user.rating <= (tournament.maxRating || 7.0);

            return (
              <div 
                key={tournament.id}
                onClick={() => onSelect(tournament)}
                className={`group relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 shadow-sm border-2 transition-all cursor-pointer active:scale-95 hover:scale-[1.02] hover:shadow-2xl ${
                  isCompatible 
                    ? 'border-emerald-500/10 hover:border-emerald-500/40' 
                    : 'border-transparent opacity-85 grayscale-[0.2]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        tournament.status === 'open' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {tournament.status === 'open' ? 'Iscrizioni Aperte' : 'Live'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors tracking-tight leading-tight">
                      {tournament.name}
                    </h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Trophy size={28} className="group-hover:rotate-12 transition-transform" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Calendar size={16} className="text-orange-500" />
                    <span>{new Date(tournament.startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Users size={16} className="text-indigo-500" />
                    <span>{tournament.teams.length}/{tournament.maxTeams} Sq.</span>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[1.5rem] p-5 flex items-center justify-between border border-indigo-100 dark:border-indigo-800/50 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                       <ShieldCheck size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Rating Range</span>
                      <span className="text-base font-black text-indigo-700 dark:text-indigo-400">{tournament.minRating?.toFixed(2)} - {tournament.maxRating?.toFixed(2)}</span>
                    </div>
                  </div>
                  {isCompatible && <Star size={16} fill="#f97316" className="text-orange-500" />}
                </div>
                
                {club && (
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-orange-500" />
                          {club.name}
                        </span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-orange-500" />
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
