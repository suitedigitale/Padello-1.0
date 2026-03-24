
import React, { useState, useMemo } from 'react';
import { Search, Trophy, GraduationCap, Users, MapPin, Calendar, ArrowRight, Bell, Shield, Siren, CheckCircle, ShieldAlert, X, MessageSquareQuote, Filter, Star, Zap, Sparkles, ChevronRight, LocateFixed } from 'lucide-react';
import { Club, Tournament, User, Booking, ManagerNotification } from '../types';
import { formatCurrency, COURTS, MOCK_OPEN_MATCHES, getLevelMetadata } from '../constants';
import { Button } from './Button';

interface ExploreProps {
  user: User;
  tournaments: Tournament[];
  clubs: Club[];
  selectedClubId?: string | null;
  bookings?: Booking[]; 
  notifications?: ManagerNotification[];
  resolvedMatchIds?: string[];
  onSelectTournament: (t: Tournament) => void;
  onSelectClub: (c: Club) => void;
  onJoinMatch: (bookingId: string) => void;
  onCheckNotification: (notificationId: string) => void;
}

type ExploreTab = 'tournaments' | 'lessons' | 'matches' | 'notifications';

export const Explore: React.FC<ExploreProps> = ({ 
  user, 
  tournaments, 
  clubs, 
  selectedClubId,
  bookings = [], 
  notifications = [],
  resolvedMatchIds = [],
  onSelectTournament, 
  onSelectClub, 
  onJoinMatch,
  onCheckNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ExploreTab>('tournaments');
  const [showCompatibleTournaments, setShowCompatibleTournaments] = useState(false);
  const [showCompatibleMatches, setShowCompatibleMatches] = useState(true); 
  const [confirmingMatch, setConfirmingMatch] = useState<any | null>(null);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);

  const isManager = user.role === 'manager' || user.role === 'super_admin';

  // Estrae le città uniche dai club per il filtro località
  const availableCities = useMemo(() => {
    const cities = clubs.map(c => {
        const parts = c.location.split(',');
        return parts.length > 1 ? parts[parts.length - 1].trim() : c.location.trim();
    });
    return Array.from(new Set(cities)).sort();
  }, [clubs]);

  const filteredContent = useMemo(() => {
    const term = searchTerm.toLowerCase();

    // Funzione helper per verificare se un club appartiene alla città selezionata
    const matchesLocation = (clubId: string) => {
        if (!selectedLocation) return true;
        const club = clubs.find(c => c.id === clubId);
        if (!club) return false;
        return club.location.toLowerCase().includes(selectedLocation.toLowerCase());
    };

    if (activeTab === 'tournaments') {
      let list = tournaments;
      
      // Filtro per Località
      if (selectedLocation) {
          list = list.filter(t => matchesLocation(t.clubId));
      }

      if (showCompatibleTournaments) {
        list = list.filter(t => user.rating >= (t.minRating || 1.0) && user.rating <= (t.maxRating || 7.0));
      }
      
      return list.filter(t => 
        t.name.toLowerCase().includes(term) || 
        clubs.find(c => c.id === t.clubId)?.name.toLowerCase().includes(term)
      );
    }

    if (activeTab === 'lessons') {
      let list = clubs;
      
      // Filtro per Località
      if (selectedLocation) {
          list = list.filter(c => c.location.toLowerCase().includes(selectedLocation.toLowerCase()));
      }

      return list.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.location.toLowerCase().includes(term)
      );
    }

    if (activeTab === 'notifications') {
      return notifications.filter(n => 
        n.status === 'pending' &&
        (n.message.toLowerCase().includes(term) || n.playerName.toLowerCase().includes(term))
      );
    }

    if (activeTab === 'matches') {
      const realMatches = bookings
        .filter(b => b.isLookingForPlayer && b.status === 'confirmed' && b.userId !== user.id && !b.isResolved && !resolvedMatchIds.includes(b.id))
        .map(b => {
            return {
                id: b.id,
                clubId: b.clubId,
                user: b.playerName || 'Utente',
                level: 'Sfida Reale', 
                time: `${b.date} • ${b.slotId}`,
                missing: 1, 
                isReal: true,
                rawBooking: b,
                creatorRating: 3.5 
            };
        });

      let allMatches = [...realMatches, ...MOCK_OPEN_MATCHES.filter(m => !resolvedMatchIds.includes(m.id))];

      // Filtro per Località
      if (selectedLocation) {
          allMatches = allMatches.filter(m => matchesLocation(m.clubId));
      }

      return allMatches.filter(m => {
        const ratingDiff = Math.abs(m.creatorRating - user.rating);
        const isLevelAffine = ratingDiff <= 1.0; 

        if (showCompatibleMatches && !isLevelAffine) return false;

        const club = clubs.find(c => c.id === m.clubId);
        return (
          club?.name.toLowerCase().includes(term) ||
          m.level.toLowerCase().includes(term) ||
          m.user.toLowerCase().includes(term)
        );
      });
    }

    return [];
  }, [searchTerm, selectedLocation, activeTab, tournaments, clubs, bookings, user, notifications, resolvedMatchIds, showCompatibleTournaments, showCompatibleMatches]);

  const handleConfirmParticipation = () => {
    if (confirmingMatch) {
      onJoinMatch(confirmingMatch.id);
      setConfirmingMatch(null);
      setTimeout(() => setShowJoinSuccess(true), 300);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      <div className="mb-6 md:mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">Bacheca Padel</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">
          {activeTab === 'notifications' ? 'Gestisci i messaggi del regno.' : 'Esplora tornei e sfide aperte.'}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8 sticky top-20 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition-all"
                    placeholder="Cerca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={`flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl shadow-sm w-full md:w-auto shrink-0 overflow-x-auto no-scrollbar`}>
                <button onClick={() => setActiveTab('tournaments')} className={`flex-1 md:flex-none md:px-5 py-2.5 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeTab === 'tournaments' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><Trophy size={14} />Tornei</button>
                <button onClick={() => setActiveTab('lessons')} className={`flex-1 md:flex-none md:px-5 py-2.5 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeTab === 'lessons' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><GraduationCap size={14} />Lezioni</button>
                <button onClick={() => setActiveTab('matches')} className={`flex-1 md:flex-none md:px-5 py-2.5 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeTab === 'matches' ? 'bg-white dark:bg-slate-700 text-red-500 dark:text-red-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><Users size={14} />Sfide</button>
                {isManager && (
                    <button onClick={() => setActiveTab('notifications')} className={`flex-1 md:flex-none md:px-5 py-2.5 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeTab === 'notifications' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><Bell size={14} />Avvisi</button>
                )}
            </div>
        </div>
        
        {/* Filtro Località compatto */}
        <div className="flex flex-col gap-2">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                <button 
                    onClick={() => setSelectedLocation(null)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedLocation === null 
                            ? 'bg-orange-500 text-white border-orange-600' 
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                >
                    Tutte le sedi
                </button>
                {availableCities.map(city => (
                    <button 
                        key={city}
                        onClick={() => setSelectedLocation(city)}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1 ${
                            selectedLocation === city 
                                ? 'bg-orange-500 text-white border-orange-600 shadow-md' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        <LocateFixed size={10} />
                        {city}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-40">
        {filteredContent.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                <MapPin size={40} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Nessun risultato</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Prova a cambiare località o termini di ricerca.</p>
            </div>
        )}

        {activeTab === 'tournaments' && filteredContent.map((t: any) => {
            const club = clubs.find(c => c.id === t.clubId);
            return (
              <div key={t.id} onClick={() => onSelectTournament(t)} className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition-all cursor-pointer group active:scale-95">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 p-2.5 rounded-xl group-hover:scale-105 transition-transform">
                    <Trophy size={20} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t.startDate}</span>
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">{t.name}</h3>
                <p className="text-slate-500 text-xs mb-4 flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" />{club?.name}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700 mt-auto">
                   <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Rating {t.minRating}-{t.maxRating}</span>
                   <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            );
        })}

        {activeTab === 'lessons' && filteredContent.map((c: any) => (
            <div key={c.id} onClick={() => onSelectClub(c)} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 group cursor-pointer active:scale-[0.98] transition-all">
              <div className="h-32 overflow-hidden relative">
                <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <MapPin size={8} className="text-orange-500" />
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200">{c.location.split(',').pop()?.trim()}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-slate-900 dark:text-white text-base mb-1 line-clamp-1">{c.name}</h3>
                <p className="text-slate-500 text-[10px] mb-3 line-clamp-1">{c.location}</p>
                <Button fullWidth variant="outline" className="h-8 text-[9px] font-black uppercase">Prenota</Button>
              </div>
            </div>
        ))}

        {activeTab === 'matches' && filteredContent.map((m: any) => {
            const club = clubs.find(c => c.id === m.clubId);
            const levelMeta = getLevelMetadata(m.creatorRating);
            return (
              <div key={m.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border-l-4 border-orange-500 flex flex-col h-full animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-md">Sfida Aperta</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{m.time}</span>
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1 truncate">{m.level}</h3>
                <p className="text-slate-500 text-xs mb-4 truncate">Sfidante: <span className="text-slate-900 dark:text-white font-bold">{m.user}</span></p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold truncate">
                            <MapPin size={12} className="text-orange-500 shrink-0" />
                            <span className="text-[10px] truncate">{club?.name}</span>
                        </div>
                    </div>
                    <button onClick={() => setConfirmingMatch(m)} className="shrink-0 bg-orange-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-orange-700 active:scale-95">Partecipa</button>
                </div>
              </div>
            );
        })}
      </div>

      {/* Modals con scroll assicurato */}
      {confirmingMatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 text-center flex flex-col max-h-[85dvh]">
              <div className="relative h-32 shrink-0">
                <img src="https://images.unsplash.com/photo-1626244101212-3c650058e1b2?q=80&w=400&auto=format&fit=crop" alt="Padel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              <div className="p-6 overflow-y-auto no-scrollbar">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Sei pronto?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
                  Confermi di partecipare alla sfida? Sir Padellotto avviserà subito lo sfidante!
                </p>
                <div className="space-y-2">
                   <Button fullWidth onClick={handleConfirmParticipation} className="h-12 rounded-xl text-sm font-black uppercase">Sì, Sfida Accettata!</Button>
                   <button onClick={() => setConfirmingMatch(null)} className="w-full py-3 text-slate-400 font-black uppercase text-[10px]">Annulla</button>
                </div>
              </div>
           </div>
        </div>
      )}

      {showJoinSuccess && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[2rem] overflow-hidden shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Gloria a te!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Sfida registrata. Riceverai una notifica non appena il campo sarà pronto.</p>
              <Button fullWidth onClick={() => setShowJoinSuccess(false)} className="h-12 rounded-xl text-sm font-black">Ottimo!</Button>
           </div>
        </div>
      )}
    </div>
  );
};
