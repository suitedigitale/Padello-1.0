
import React, { useMemo } from 'react';
import { Booking, Court } from '../types';
import { formatCurrency } from '../constants';
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, Activity, ArrowUpRight } from 'lucide-react';

interface AdminStatsProps {
  bookings: Booking[];
  courts: Court[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({ bookings, courts }) => {
  // --- Data Calculation ---
  const stats = useMemo(() => {
    const monthlyData: Record<string, { revenue: number; count: number }> = {};
    let totalRevenue = 0;
    
    // Filtriamo prenotazioni valide (escludiamo manutenzione/unavailable dal conteggio statistico dei ricavi)
    const validBookings = bookings.filter(b => b.status !== 'unavailable');
    let totalBookings = validBookings.length;

    validBookings.forEach(booking => {
        totalRevenue += booking.totalPrice;

        const date = new Date(booking.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, count: 0 };
        }
        monthlyData[monthKey].revenue += booking.totalPrice;
        monthlyData[monthKey].count += 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => b.localeCompare(a)); // Ordine cronologico inverso per la tabella
    const maxRevenue = Math.max(...Object.values(monthlyData).map(d => d.revenue), 100);
    const maxCount = Math.max(...Object.values(monthlyData).map(d => d.count), 1);

    return {
        totalRevenue,
        totalBookings,
        monthlyData,
        sortedMonths,
        maxRevenue,
        maxCount
    };
  }, [bookings]);

  const getMonthName = (key: string) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(date);
  };

  const getShortMonth = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('it-IT', { month: 'short' }).format(date);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-24">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                <div className="absolute -right-2 -top-2 text-orange-500/10 rotate-12 group-hover:rotate-0 transition-transform">
                  <DollarSign size={80} />
                </div>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                    <Activity size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ricavi Totali</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(stats.totalRevenue)}</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                <div className="absolute -right-2 -top-2 text-indigo-500/10 rotate-12 group-hover:rotate-0 transition-transform">
                  <Calendar size={80} />
                </div>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Partite Giocate</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalBookings}</div>
            </div>
        </div>

        {/* Visual Chart: Prenotazioni Mensili (Volume) */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                  <BarChart3 size={18} className="text-orange-500" />
                  Andamento Volumi
               </h3>
               <span className="text-[10px] font-bold text-slate-400">ULTIMI MESI</span>
             </div>

            {stats.sortedMonths.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic">
                    Nessun dato registrato
                </div>
            ) : (
                <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
                    {[...stats.sortedMonths].reverse().map(month => {
                        const data = stats.monthlyData[month];
                        const heightPercentage = Math.max((data.count / stats.maxCount) * 100, 8);

                        return (
                            <div key={month} className="flex flex-col items-center flex-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-xl translate-y-2 group-hover:translate-y-0 uppercase tracking-widest">
                                    {data.count} Prenotazioni
                                </div>

                                {/* Bar */}
                                <div 
                                    style={{ height: `${heightPercentage}%` }} 
                                    className="w-full max-w-[32px] bg-orange-100 dark:bg-orange-900/20 rounded-t-xl relative group-hover:bg-orange-500/20 transition-all duration-300"
                                >
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-t-xl transition-all duration-700 shadow-lg shadow-orange-500/20" 
                                        style={{ height: '100%' }}
                                    />
                                </div>
                                
                                {/* Label */}
                                <span className="text-[9px] font-black text-slate-400 mt-3 uppercase tracking-tighter">{getShortMonth(month)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>

        {/* Breakdown Table: Dettaglio Mensile */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Dettaglio Mensile</h3>
            
            <div className="space-y-3">
                {stats.sortedMonths.map(month => (
                    <div key={month} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-orange-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm border border-slate-100 dark:border-slate-700">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{getMonthName(month)}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stats.monthlyData[month].count} partite</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(stats.monthlyData[month].revenue)}</div>
                            <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                <ArrowUpRight size={10} />
                                <span>SALDO</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Courts Popularity */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-500" />
                    Utilizzo Campi
                </h3>
            </div>
            
            <div className="space-y-5">
                {courts.map(court => {
                    const count = bookings.filter(b => b.courtId === court.id && b.status !== 'unavailable').length;
                    const percentage = stats.totalBookings > 0 ? Math.round((count / stats.totalBookings) * 100) : 0;

                    return (
                        <div key={court.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Identificativo</span>
                                  <span className="font-black text-slate-800 dark:text-white text-sm">{court.name}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-slate-900 dark:text-white text-sm">{count} match</span>
                                  <span className="text-[10px] font-bold text-indigo-500 ml-2">{percentage}%</span>
                                </div>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out" 
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    </div>
  );
};
