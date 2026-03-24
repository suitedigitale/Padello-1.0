
import React, { useMemo } from 'react';
import { formatDate } from '../constants';

interface DateSelectorProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect }) => {
  const dates = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const isSelected = (d: Date) => formatDate(d) === formatDate(selectedDate);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 sticky top-20 z-[100] transition-colors duration-200">
      <div className="max-w-3xl mx-auto overflow-x-auto no-scrollbar px-4 flex gap-3">
        {dates.map((date) => {
          const active = isSelected(date);
          const dayName = new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(date);
          const dayNum = date.getDate();
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={`
                flex flex-col items-center justify-center min-w-[64px] p-3 rounded-2xl transition-all duration-200
                ${active 
                  ? 'bg-orange-500 text-white shadow-lg scale-105' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'}
              `}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{dayName}</span>
              <span className={`text-xl font-black ${active ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
