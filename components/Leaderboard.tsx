
import React, { useState, useMemo } from 'react';
import { User, Booking } from '../types';
import { Trophy, Medal, Crown, ArrowLeft, TrendingUp, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';
import { getLevelMetadata } from '../constants';

interface LeaderboardProps {
  users: User[];
  bookings: Booking[];
  currentUserId: string;
  onBack: () => void;
}

type SortFilter = 'rating' | 'wins' | 'losses';

export const Leaderboard: React.FC<LeaderboardProps> = ({ users, bookings, currentUserId, onBack }) => {
  const [filter, setFilter] = useState<SortFilter>('rating');

  const sortedUsers = useMemo(() => {
    const usersWithStats = users.map(user => {
      const userMatches = bookings.filter(b => b.userId === user.id && b.result);
      const wins = userMatches.filter(b => b.result?.outcome === 'won').length;
      const losses = userMatches.filter(b => b.result?.outcome === 'lost').length;
      return { ...user, stats: { wins, losses } };
    });

    return usersWithStats.sort((a, b) => {
      if (filter === 'wins') {
        if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
        return b.rating - a.rating;
      }
      if (filter === 'losses') {
        if (b.stats.losses !== a.stats.losses) return b.stats.losses - a.stats.losses;
        return b.rating - a.rating;
      }
      return b.rating - a.rating;
    });
  }, [users, bookings, filter]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown size={28} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />;
      case 1: return <Medal size={28} className="text-slate-400 fill-slate-400 drop-shadow-sm" />;
      case 2: return <Medal size={28} className="text-amber-700 fill-amber-700 drop-shadow-sm" />;
      default: return <span className="font-black text-slate-300 w-8 text-center text-xl">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-colors shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={28} className="text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-2xl shadow-lg shadow-orange-500/20">
               <Trophy size={32} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Classifica Pro</h2>
          </div>
        </div>

        <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm md:w-[450px]">
          <button onClick={() => setFilter('rating')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${filter === 'rating' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}><TrendingUp size={16} />Livello</button>
          <button onClick={() => setFilter('wins')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${filter === 'wins' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}><ThumbsUp size={16} />Vittorie</button>
          <button onClick={() => setFilter('losses')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${filter === 'losses' ? 'bg-white dark:bg-slate-700 text-red-500 dark:text-red-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}><ThumbsDown size={16} />Sconfitte</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-2 lg:order-1 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
          <h3 className="text-center font-black text-slate-400 uppercase tracking-widest text-sm mb-12">Top 3 Campioni</h3>
          <div className="flex flex-col items-center gap-12">
              {sortedUsers[0] && (
                  <div className="flex flex-col items-center scale-125 mb-4">
                      <div className="w-24 h-24 rounded-3xl bg-yellow-400 flex items-center justify-center text-4xl font-black text-white relative shadow-2xl rotate-3">
                           <Crown size={36} className="absolute -top-10 -right-4 text-yellow-500 fill-yellow-500 rotate-12" />
                           <span className="-rotate-3">{sortedUsers[0].name.charAt(0)}</span>
                      </div>
                      <span className="text-lg font-black mt-6 text-slate-900 dark:text-white text-center">{sortedUsers[0].name}</span>
                      <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full ${getLevelMetadata(sortedUsers[0].rating).bg} ${getLevelMetadata(sortedUsers[0].rating).text} text-[10px] font-black uppercase tracking-widest border ${getLevelMetadata(sortedUsers[0].rating).border}`}>
                         <Shield size={10} className="fill-current" />
                         {getLevelMetadata(sortedUsers[0].rating).label}
                      </div>
                  </div>
              )}
              <div className="grid grid-cols-2 gap-8 w-full">
                {sortedUsers[1] && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-slate-300 flex items-center justify-center text-3xl font-black text-white shadow-xl -rotate-3">
                           <span>{sortedUsers[1].name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-black mt-4 text-slate-700 dark:text-slate-200 text-center">{sortedUsers[1].name}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{getLevelMetadata(sortedUsers[1].rating).label}</span>
                    </div>
                )}
                {sortedUsers[2] && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-3">
                           <span>{sortedUsers[2].name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-black mt-4 text-slate-700 dark:text-slate-200 text-center">{sortedUsers[2].name}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{getLevelMetadata(sortedUsers[2].rating).label}</span>
                    </div>
                )}
              </div>
          </div>
        </div>

        <div className="lg:col-span-8 order-1 lg:order-2 space-y-3 pb-32">
          {sortedUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            const levelMeta = getLevelMetadata(user.rating);
            return (
              <div key={user.id} className={`group flex items-center gap-6 p-5 rounded-3xl border transition-all duration-300 ${isCurrentUser ? 'bg-orange-500 text-white border-orange-400 shadow-xl shadow-orange-500/20 scale-[1.02]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:shadow-lg'}`}>
                <div className="flex items-center justify-center w-12 shrink-0">{getRankIcon(index)}</div>
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-inner ${isCurrentUser ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className={`font-black truncate text-lg ${isCurrentUser ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{user.name}</h3>
                       {!isCurrentUser && (
                          <div className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${levelMeta.bg} ${levelMeta.text} text-[8px] font-black uppercase tracking-wider border ${levelMeta.border}`}>
                             {levelMeta.label}
                          </div>
                       )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${isCurrentUser ? 'text-white/80' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg'}`}>Vinte: {user.stats.wins}</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${isCurrentUser ? 'text-white/80' : 'text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-lg'}`}>Perse: {user.stats.losses}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-black font-mono leading-none ${isCurrentUser ? 'text-white' : 'text-orange-500'}`}>{user.rating.toFixed(2)}</div>
                  <div className={`text-[10px] uppercase font-black tracking-[0.2em] mt-1 ${isCurrentUser ? 'text-white/60' : 'text-slate-400'}`}>Rating</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
