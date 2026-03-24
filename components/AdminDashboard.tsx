
import React, { useState } from 'react';
import { ArrowLeft, Settings, Plus, Edit2, Trash2, Save, Cloud, Sun, BarChart3, LayoutDashboard, Trophy, Image as ImageIcon, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { Court, Club, Booking, Tournament } from '../types';
import { Button } from './Button';
import { formatCurrency } from '../constants';
import { AdminStats } from './AdminStats';

interface AdminDashboardProps {
  club: Club;
  courts: Court[];
  clubBookings: Booking[]; 
  clubTournaments: Tournament[];
  racketPrice: number;
  instructorPrice: number;
  onBack: () => void;
  onUpdateGlobalPrices: (racket: number, instructor: number) => void;
  onAddCourt: () => void;
  onEditCourt: (court: Court) => void;
  onDeleteCourt: (id: number) => void;
  onEditClub: (club: Club) => void;
  onEditTournament: (tournament: Tournament) => void;
  onAddTournament: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  club,
  courts,
  clubBookings,
  clubTournaments,
  racketPrice,
  instructorPrice,
  onBack,
  onUpdateGlobalPrices,
  onAddCourt,
  onEditCourt,
  onDeleteCourt,
  onEditClub,
  onEditTournament,
  onAddTournament
}) => {
  const [activeTab, setActiveTab] = useState<'management' | 'tournaments' | 'stats'>('management');
  const [localRacketPrice, setLocalRacketPrice] = React.useState(racketPrice);
  const [localInstructorPrice, setLocalInstructorPrice] = React.useState(instructorPrice);

  const handleSavePrices = () => {
    onUpdateGlobalPrices(localRacketPrice, localInstructorPrice);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="sticky top-20 bg-slate-50 dark:bg-slate-950 pt-2 pb-4 z-[90] transition-colors duration-200 mb-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors shadow-sm border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-900 shadow-lg shadow-amber-500/20">
               <Settings size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{club.name}</h2>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pannello di Controllo</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'management' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Gestione</span>
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'tournaments' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <Trophy size={16} />
            <span className="hidden sm:inline">Tornei</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Stats</span>
          </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <AdminStats bookings={clubBookings} courts={courts} />
      ) : activeTab === 'tournaments' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-32 pt-2">
          <div className="flex justify-between items-center px-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">I tuoi Tornei</h3>
              <p className="text-xs text-slate-500 font-bold">Organizza la gloria del circolo</p>
            </div>
            <button 
              onClick={onAddTournament}
              className="bg-amber-500 text-white p-3 rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {clubTournaments.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm group hover:border-amber-500 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-2">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      t.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {t.status === 'open' ? 'Iscrizioni' : 'Live'}
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-tight">{t.name}</h4>
                  </div>
                  <button onClick={() => onEditTournament(t)} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl text-slate-400 hover:text-amber-500 transition-colors border border-slate-100 dark:border-slate-600">
                    <Edit2 size={18} />
                  </button>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(t.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl">
                    <Users size={14} className="text-slate-400" />
                    <span>{t.teams.length}/{t.maxTeams} Sq.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-32 pt-2">
          {/* Identity and Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center gap-5">
                   <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 shrink-0">
                      <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dati Circolo</h3>
                      <div className="font-black text-slate-900 dark:text-white text-2xl truncate leading-tight mb-2">{club.name}</div>
                   </div>
                </div>
                <Button fullWidth onClick={() => onEditClub(club)} variant="outline" className="mt-8 h-12 rounded-xl">
                   <Edit2 size={16} className="mr-2" />
                   Modifica Profilo Circolo
                </Button>
             </section>

             <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 shadow-sm border border-slate-200 dark:border-slate-700">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Listino Extra</h3>
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Noleggio Pala</label>
                      <div className="relative">
                        <input type="number" value={localRacketPrice} onChange={(e) => setLocalRacketPrice(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 font-mono font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">€</span>
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lezione Maestro</label>
                      <div className="relative">
                        <input type="number" value={localInstructorPrice} onChange={(e) => setLocalInstructorPrice(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 font-mono font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">€</span>
                      </div>
                  </div>
               </div>
               <Button fullWidth onClick={handleSavePrices} className="h-12 rounded-xl">Salva Listino</Button>
             </section>
          </div>

          {/* Courts Section */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Campi da Gioco</h3>
                <p className="text-xs font-bold text-slate-400">Gestisci la disponibilità e i prezzi per campo</p>
              </div>
              <button onClick={onAddCourt} className="bg-emerald-500 text-white p-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                <Plus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courts.map((court) => (
                <div key={court.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-orange-500/40 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-sm ${court.type === 'indoor' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-600'}`}>
                      {court.type === 'indoor' ? <Cloud size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-lg leading-tight">{court.name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{formatCurrency(court.price)} / Partita</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditCourt(court)} className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDeleteCourt(court.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
