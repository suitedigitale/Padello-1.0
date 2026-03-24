
import React, { useMemo } from 'react';
import { MessageSquare, Heart, Share2, TrendingUp, Trophy, Siren, Hand, ArrowRightLeft, UserPlus, ArrowLeft, Target, Zap, ChevronRight, Shield } from 'lucide-react';
import { CommunityPost, User, Club } from '../types';
import { MOCK_COMMUNITY_POSTS, getLevelMetadata } from '../constants';

interface CommunityProps {
  user: User;
  allUsers: User[];
  selectedClub: Club | null;
  onBack: () => void;
  onAskToPlay: (player: User) => void;
  onQuickSearch: () => void;
}

export const Community: React.FC<CommunityProps> = ({ user, allUsers, selectedClub, onBack, onAskToPlay, onQuickSearch }) => {
  const suggestedPlayers = useMemo(() => {
    return allUsers
      .filter(u => u.id !== user.id) 
      .filter(u => {
        const ratingDiff = Math.abs(u.rating - user.rating);
        return ratingDiff <= 1.0; 
      })
      .sort((a, b) => {
        return Math.abs(a.rating - user.rating) - Math.abs(b.rating - user.rating);
      })
      .slice(0, 6); 
  }, [user, allUsers]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'level_up': return <TrendingUp size={20} className="text-emerald-500" />;
      case 'tournament': return <Trophy size={20} className="text-amber-500" />;
      case 'match_sos': return <Siren size={20} className="text-red-500" />;
      default: return <MessageSquare size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
        <button 
          onClick={onBack} 
          className="w-fit p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-slate-800 group"
        >
          <ArrowLeft size={28} className="text-slate-700 dark:text-slate-200 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Community</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Connettiti con i guerrieri del Padel più affini al tuo stile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <section className="lg:col-span-4 order-2 lg:order-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap size={16} className="text-orange-500 fill-current" />
              Sfidanti Ideali
            </h3>
            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">AI MATCHING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {suggestedPlayers.map(p => {
              const ratingDiff = Math.abs(p.rating - user.rating);
              const affinity = Math.max(0, 100 - Math.floor(ratingDiff * 50));
              const levelMeta = getLevelMetadata(p.rating);

              return (
                <div 
                  key={p.id} 
                  className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-xl hover:border-orange-500/20 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${levelMeta.bg.replace('bg-', 'bg-').split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-2xl font-black text-slate-400 dark:text-slate-500 shadow-inner group-hover:scale-105 transition-transform">
                      {p.name.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] px-2 py-1 rounded-lg font-black border-2 border-white dark:border-slate-800 shadow-md">
                      {p.rating.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-black text-slate-900 dark:text-white text-base truncate pr-2">{p.name}</h4>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">{affinity}% Affinità</span>
                    </div>
                    
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${levelMeta.bg} ${levelMeta.text} text-[8px] font-black uppercase tracking-wider border ${levelMeta.border} mb-3`}>
                       <Shield size={8} className="fill-current" />
                       {levelMeta.label}
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        <Hand size={10} />
                        {p.hand === 'right' ? 'DX' : 'SX'}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        <Target size={10} />
                        {p.side === 'indifferent' ? 'MIX' : p.side === 'left' ? 'SIN' : 'DES'}
                      </div>
                    </div>

                    <button 
                      onClick={() => onAskToPlay(p)}
                      className="w-full py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Invia Sfida</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="font-black text-lg leading-tight mb-2">Trova un Compagno al Volo</h4>
                <p className="text-indigo-100 text-xs font-medium mb-4 leading-relaxed">
                  Non hai nessuno con cui giocare? Sir Padellotto cercherà per te un giocatore affine nel raggio di 10km.
                </p>
                <button 
                  onClick={onQuickSearch}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Attiva Ricerca Veloce
                </button>
             </div>
             <Shield size={120} className="absolute -bottom-8 -right-8 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </section>

        <section className="lg:col-span-8 space-y-8 pb-32 order-1 lg:order-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-500" />
            Flusso Attività
          </h3>

          {MOCK_COMMUNITY_POSTS.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xl text-slate-400 dark:text-slate-500 shadow-inner">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-3">
                      {post.authorName}
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                        {getPostIcon(post.type)}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      {new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(post.timestamp)}
                    </div>
                  </div>
                </div>
                <button className="p-3 text-slate-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-2xl transition-all">
                  <Share2 size={22} />
                </button>
              </div>

              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-8">
                {post.text}
              </p>

              <div className="flex items-center gap-8 pt-6 border-t border-slate-50 dark:border-slate-700">
                <button className="group flex items-center gap-2.5 text-slate-400 hover:text-red-500 transition-all">
                  <div className="p-3 rounded-2xl group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                    <Heart size={24} className="group-active:scale-125 transition-transform" />
                  </div>
                  <span className="text-sm font-black tracking-tighter">{post.likes}</span>
                </button>
                <button className="group flex items-center gap-2.5 text-slate-400 hover:text-indigo-500 transition-all">
                  <div className="p-3 rounded-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-[10px]">Commenta</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
