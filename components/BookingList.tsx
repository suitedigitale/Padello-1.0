
import React, { useMemo, useState } from 'react';
import { COURTS, TIME_SLOTS, CLUBS, formatCurrency } from '../constants';
import { Booking, MatchResult } from '../types';
import { Calendar, Clock, MapPin, Package, ArrowLeft, CreditCard, Banknote, CheckCircle, Hourglass, ArrowUpDown, History, Trophy, Medal, Filter, ArrowUp, ArrowDown, Siren } from 'lucide-react';
import { Button } from './Button';

interface BookingListProps {
  bookings: Booking[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onRecordResult: (bookingId: string) => void;
  onToggleSearch: (bookingId: string) => void;
}

type TabType = 'upcoming' | 'history';
type HistoryFilter = 'all' | 'won' | 'lost';
type HistorySort = 'newest' | 'oldest';

export const BookingList: React.FC<BookingListProps> = ({ bookings, onBack, onDelete, onRecordResult, onToggleSearch }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [historySort, setHistorySort] = useState<HistorySort>('newest');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const { upcoming, history } = useMemo(() => {
    const upcomingList: Booking[] = [];
    const historyList: Booking[] = [];

    bookings.forEach(b => {
      if (b.date < todayStr) {
        historyList.push(b);
      } else {
        if (b.status === 'pending_payment' || b.status === 'confirmed') {
          upcomingList.push(b);
        }
      }
    });

    return { upcoming: upcomingList, history: historyList };
  }, [bookings, todayStr]);

  const displayedBookings = useMemo(() => {
    if (activeTab === 'history') {
      let list = [...history];
      if (historyFilter !== 'all') {
        list = list.filter(b => b.result?.outcome === historyFilter);
      }
      list.sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return historySort === 'newest' ? timeB - timeA : timeA - timeB;
      });
      return list;
    }
    return [...upcoming].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.slotId.localeCompare(b.slotId);
    });
  }, [upcoming, history, activeTab, historyFilter, historySort]);

  const getStatusConfig = (status: Booking['status']) => {
    if (status === 'confirmed') {
      return {
        label: 'Confermato',
        styles: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        icon: CheckCircle
      };
    }
    return {
      label: 'Da Saldare',
      styles: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      icon: Hourglass
    };
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="sticky top-20 bg-slate-50 dark:bg-slate-950 pt-2 pb-4 z-[90] transition-colors duration-200">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors shadow-sm border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-200" />
          </button>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Le mie Partite</h2>
        </div>

        <div className="grid grid-cols-2 p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'upcoming' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            In Programma ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Storico ({history.length})
          </button>
        </div>
        
        {activeTab === 'history' && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-1 animate-in fade-in slide-in-from-top-2">
             <div className="flex gap-2 w-full sm:w-auto">
                {['all', 'won', 'lost'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setHistoryFilter(f as HistoryFilter)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border ${historyFilter === f ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                  >
                    {f === 'all' ? 'Tutti' : f === 'won' ? 'Vinte' : 'Perse'}
                  </button>
                ))}
             </div>
             <button 
               onClick={() => setHistorySort(prev => prev === 'newest' ? 'oldest' : 'newest')}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors"
             >
               {historySort === 'newest' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
               <span>{historySort === 'newest' ? 'Più Recenti' : 'Meno Recenti'}</span>
             </button>
          </div>
        )}
      </div>

      {displayedBookings.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 mt-4">
          <div className="bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            {activeTab === 'upcoming' ? <Calendar size={40} className="text-slate-300" /> : <History size={40} className="text-slate-300" />}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase">Tabula Rasa</h3>
          <p className="text-slate-500 dark:text-slate-400 px-12">
            Non ci sono partite registrate in questa sezione. Corri a prenotare!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-32 pt-4">
          {displayedBookings.map((booking, index) => {
            const court = COURTS.find(c => c.id === booking.courtId);
            const club = CLUBS.find(c => c.id === booking.clubId);
            const slot = TIME_SLOTS.find(s => s.id === booking.slotId);
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;
            if (!court || !slot) return null;

            return (
              <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                {activeTab === 'history' && booking.result && (
                  <div className={`absolute top-0 right-0 p-4 rounded-bl-[2rem] ${booking.result.outcome === 'won' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white shadow-inner'}`}>
                    {booking.result.outcome === 'won' ? <Trophy size={20} className="animate-bounce-slow" /> : <span className="text-xs font-black uppercase">KO</span>}
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-1.5 rounded-lg">
                        <Calendar size={14} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(booking.date))}
                      </span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusConfig.styles}`}>
                      <StatusIcon size={12} />
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {formatCurrency(booking.totalPrice)}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <MapPin size={12} className="text-orange-500" />
                    <span>{club?.name}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors">{court.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                    <Clock size={16} />
                    <span className="font-bold text-sm">{slot.startTime} - {slot.endTime} (90 min)</span>
                  </div>
                </div>

                {activeTab === 'upcoming' ? (
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50 dark:border-slate-700">
                    <button 
                      onClick={() => onToggleSearch(booking.id)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${booking.isLookingForPlayer ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white'}`}
                    >
                      <Siren size={16} className={booking.isLookingForPlayer ? 'animate-pulse' : ''} />
                      {booking.isLookingForPlayer ? 'SOS Attivo' : 'Cerca Compagno'}
                    </button>
                    <button 
                      onClick={() => onDelete(booking.id)}
                      className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all border border-transparent hover:border-red-200"
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-50 dark:border-slate-700">
                    {booking.result ? (
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Esito Finale</span>
                          <span className="text-lg font-black text-slate-800 dark:text-white font-mono tracking-widest">{booking.result.score}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${booking.result.outcome === 'won' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                           {booking.result.outcome === 'won' ? 'Vittoria' : 'Sconfitta'}
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" fullWidth onClick={() => onRecordResult(booking.id)} className="h-14 rounded-2xl">
                        <Medal size={18} className="mr-2" />
                        <span className="font-black uppercase tracking-widest text-xs">Registra Risultato</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
