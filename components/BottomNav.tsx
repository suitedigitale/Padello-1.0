
import React from 'react';
import { LayoutGrid, MessageSquare, Compass, BarChart3, Calendar } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const tabs = [
    { id: 'home', label: 'Prenota', icon: LayoutGrid },
    { id: 'community', label: 'Social', icon: MessageSquare },
    { id: 'explore', label: 'Bacheca', icon: Compass },
    { id: 'leaderboard', label: 'Ranking', icon: BarChart3 },
    { id: 'bookings', label: 'Partite', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-around h-20 px-4 pb-safe">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id || (tab.id === 'home' && (currentView === 'tournament_detail' || currentView === 'tournaments'));
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all duration-300 active:scale-90 relative ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-orange-50 dark:bg-orange-900/30 scale-110 shadow-sm' : 'bg-transparent'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
