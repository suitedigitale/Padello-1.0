
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Save, TrendingUp, Hand, Sun, Moon, Sunrise, 
  Activity, Trophy, Shield, User as UserIcon, 
  Target, Award, Users, Zap, Clock, MousePointer2,
  Sword, ShieldHalf, ChevronRight
} from 'lucide-react';
import { Button } from './Button';
import { User, PlayerHand, CourtSide, PreferredTime, Booking } from '../types';
import { getLevelDescription, getLevelMetadata } from '../constants';

interface ProfileModalProps {
  user: User;
  bookings: Booking[];
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, bookings, onClose, onSave }) => {
  const [hand, setHand] = useState<PlayerHand>(user.hand || 'right');
  const [side, setSide] = useState<CourtSide>(user.side || 'indifferent');
  const [preferredTime, setPreferredTime] = useState<PreferredTime>(user.preferredTime || 'evening');

  const isAdmin = user.role === 'super_admin' || user.role === 'manager';

  // --- Dinamyc Rating Calculation ---
  const { currentRating, stats, ratingHistory } = useMemo(() => {
    const userMatches = bookings.filter(b => b.userId === user.id && b.result);
    const wins = userMatches.filter(b => b.result?.outcome === 'won').length;
    const losses = userMatches.filter(b => b.result?.outcome === 'lost').length;
    
    // Base rating from user profile
    let calculated = user.rating;
    
    // Simulate real-time adjustment based on results
    // Each win adds 0.05, each loss subtracts 0.02
    calculated = calculated + (wins * 0.05) - (losses * 0.02);
    
    // Generate a more interesting history based on these results
    const history = [...(user.ratingHistory || [])];
    if (history.length < 4) {
        // Fallback fake history if empty
        history.unshift(calculated - 0.4, calculated - 0.25, calculated - 0.1);
    }
    // Add current calculated as last point
    history.push(calculated);

    return { 
        currentRating: calculated,
        stats: { wins, losses, total: userMatches.length },
        ratingHistory: history.slice(-8) // Take last 8 points
    };
  }, [user, bookings]);

  const powerScore = useMemo(() => {
    const base = currentRating * 10;
    const experienceBonus = Math.min(stats.total * 0.2, 10); 
    const specializationBonus = side !== 'indifferent' ? 5 : 2; 
    const handBonus = hand === 'left' ? 3 : 1; // Lefties have a tactical advantage
    return Math.min(100, (base + experienceBonus + specializationBonus + handBonus)).toFixed(1);
  }, [currentRating, stats.total, side, hand]);

  const handleSave = () => {
    onSave({
      rating: currentRating,
      hand,
      side,
      preferredTime,
      ratingHistory // Sync back the simulated history
    });
  };

  // --- SVG Chart Configuration ---
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 30;

  const maxVal = Math.max(...ratingHistory, currentRating + 0.3);
  const minVal = Math.min(...ratingHistory, currentRating - 0.3);
  const spread = maxVal - minVal || 1.0;

  const points = useMemo(() => {
    return ratingHistory.map((val, idx) => {
      const x = (idx / (ratingHistory.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - padding - ((val - minVal) / spread) * (chartHeight - padding * 2);
      return { x, y };
    });
  }, [ratingHistory, minVal, spread]);

  const pathData = useMemo(() => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [points]);

  const areaData = useMemo(() => {
    if (points.length < 2) return "";
    return `${pathData} V ${chartHeight} H ${points[0].x} Z`;
  }, [pathData, points]);

  const levelMeta = getLevelMetadata(currentRating);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 rotate-3">
                <UserIcon size={36} className="-rotate-3" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl border-4 border-white dark:border-slate-900 shadow-lg" title="Power Score">
                 <Zap size={16} fill="currentColor" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">{user.name}</h2>
              <div className="flex items-center gap-2">
                 <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide uppercase">{user.email}</span>
                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${levelMeta.bg} ${levelMeta.text} border ${levelMeta.border}`}>
                    {levelMeta.label}
                 </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Power Score</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{powerScore}%</div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
              <X size={24} className="text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Analytics */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={18} className="text-orange-500" />
                    Analisi di Carriera
                  </h3>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ultimi 8 Match</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <div className={`w-3 h-3 rounded-full ${levelMeta.bg.replace('bg-', 'bg-').split(' ')[0]} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating Dinamico</div>
                      </div>
                      <div className="text-6xl font-black leading-none tracking-tighter flex items-end gap-2">
                         <span className={levelMeta.text}>{currentRating.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Win Ratio</div>
                       <div className="text-2xl font-black text-emerald-500">
                         {stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0}%
                       </div>
                    </div>
                  </div>

                  <div className="relative h-[180px] w-full">
                    <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="overflow-visible">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaData} fill="url(#areaGradient)" className="transition-all duration-1000 ease-in-out" />
                      <path d={pathData} fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-1000 ease-in-out drop-shadow-lg" />
                      {points.map((p, i) => (
                        <g key={i} className="group/dot">
                          <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 8 : 4} fill={i === points.length - 1 ? "#f97316" : "white"} stroke="#f97316" strokeWidth="3" />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </section>

              {/* Combat Stats Insight */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    <Sword size={28} className="text-orange-500 mb-3" />
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attacco</div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-orange-500" style={{ width: side === 'left' ? '85%' : side === 'right' ? '45%' : '65%' }} />
                    </div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    <ShieldHalf size={28} className="text-indigo-500 mb-3" />
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Difesa</div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: side === 'right' ? '85%' : side === 'left' ? '45%' : '65%' }} />
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Preferences */}
            <div className="space-y-10">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-500" />
                  Assetto Tattico
                </h3>
                
                <div className="space-y-8">
                  {/* Visual Hand Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mano Dominante</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setHand('right')} className={`py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${hand === 'right' ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                        <Hand size={18} className={hand === 'right' ? 'fill-current' : ''} />
                        Destro
                      </button>
                      <button onClick={() => setHand('left')} className={`py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${hand === 'left' ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                        <Hand size={18} className={hand === 'left' ? 'fill-current' : ''} style={{ transform: 'scaleX(-1)' }} />
                        Mancino
                      </button>
                    </div>
                  </div>

                  {/* Time Preference */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Slot Orario Ideale</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setPreferredTime('morning')} className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${preferredTime === 'morning' ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}>
                        <Sunrise size={20} />
                        <span className="text-[9px] font-black uppercase">Mattina</span>
                      </button>
                      <button onClick={() => setPreferredTime('afternoon')} className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${preferredTime === 'afternoon' ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}>
                        <Sun size={20} />
                        <span className="text-[9px] font-black uppercase">Pomeriggio</span>
                      </button>
                      <button onClick={() => setPreferredTime('evening')} className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${preferredTime === 'evening' ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}>
                        <Moon size={20} />
                        <span className="text-[9px] font-black uppercase">Sera</span>
                      </button>
                    </div>
                  </div>

                  {/* Field Side Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Posizione Preferita (Lato)</label>
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-700">
                      <button onClick={() => setSide('left')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${side === 'left' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Sinistro</button>
                      <button onClick={() => setSide('indifferent')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${side === 'indifferent' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Mix</button>
                      <button onClick={() => setSide('right')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${side === 'right' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Destro</button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 italic px-1">
                       <MousePointer2 size={10} />
                       {side === 'left' ? 'Focus offensivo, risposte aggressive' : side === 'right' ? 'Focus difensivo, costruzione del punto' : 'Massima versatilità tattica'}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer: Save Action */}
        <div className="p-8 md:p-10 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-md mx-auto">
            <Button fullWidth onClick={handleSave} className="h-16 rounded-[1.8rem] shadow-2xl shadow-orange-500/20 active:scale-95 transition-transform">
              <div className="flex items-center justify-center gap-3">
                <Save size={24} />
                <span className="text-xl font-black uppercase tracking-[0.15em]">Sincronizza Profilo</span>
              </div>
            </Button>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
               Ultima sincronizzazione: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
