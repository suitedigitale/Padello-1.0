
import React, { useState, useMemo } from 'react';
import { MapPin, ArrowRight, PlusCircle, Search } from 'lucide-react';
import { Club, User } from '../types';

interface ClubListProps {
  clubs: Club[];
  currentUser: User;
  onSelect: (club: Club) => void;
  onAddClub: () => void;
}

export const ClubList: React.FC<ClubListProps> = ({ clubs, currentUser, onSelect, onAddClub }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClubs = useMemo(() => {
    if (!searchTerm) return clubs;
    const lowerTerm = searchTerm.toLowerCase();
    return clubs.filter(club => 
      club.name.toLowerCase().includes(lowerTerm) || 
      club.location.toLowerCase().includes(lowerTerm)
    );
  }, [clubs, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="mb-10 mt-4 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Scegli il tuo Circolo</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          Accedi ai campi più esclusivi d'Italia con il tuo account Padello.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="relative mb-10 max-w-2xl md:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <input 
          type="text"
          placeholder="Cerca per nome o città (es. Milano, Roma)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {filteredClubs.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">Nessun circolo trovato per "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-orange-500 font-black hover:underline">Mostra tutti</button>
          </div>
        ) : (
          filteredClubs.map((club) => (
            <div 
              key={club.id}
              onClick={() => onSelect(club)}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={club.image} 
                  alt={club.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                   <div className="flex items-center gap-1.5 text-white/90 mb-1">
                    <MapPin size={14} className="text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">{club.location.split(',')[1] || club.location}</span>
                  </div>
                  <h3 className="font-black text-2xl text-white tracking-tight leading-none">
                    {club.name}
                  </h3>
                </div>
              </div>
              
              <div className="p-6 flex justify-between items-center bg-white dark:bg-slate-800 mt-auto border-t border-slate-50 dark:border-slate-700/50">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors">Visualizza Campi</span>
                <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-2xl text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-300">
                  <ArrowRight size={22} />
                </div>
              </div>
            </div>
          ))
        )}

        {/* Create Club Card - Only for Super Admin */}
        {currentUser.role === 'super_admin' && (
          <button
            onClick={onAddClub}
            className="w-full h-[280px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-all group p-6"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-[2rem] group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all duration-500 group-hover:scale-110 shadow-inner">
              <PlusCircle size={32} />
            </div>
            <div className="text-center">
              <span className="font-black text-lg uppercase tracking-tight block">Nuovo Circolo</span>
              <span className="text-xs font-medium opacity-60">Riservato agli Amministratori</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
