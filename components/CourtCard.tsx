
import React, { useRef } from 'react';
import { Cloud, Sun, Lock, ChevronRight, ChevronLeft, GraduationCap, Ban, Clock } from 'lucide-react';
import { Court, TimeSlot, Booking } from '../types';
import { formatCurrency, INSTRUCTOR_PRICE } from '../constants';

interface CourtCardProps {
  court: Court;
  timeSlots: TimeSlot[];
  dayBookings: Booking[];
  isAdmin: boolean;
  isLessonMode?: boolean;
  showAvailableOnly?: boolean;
  onSlotClick: (court: Court, slot: TimeSlot) => void;
  onShowToast: (message: string) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  timeSlots,
  dayBookings,
  isAdmin,
  isLessonMode = false,
  showAvailableOnly = false,
  onSlotClick,
  onShowToast
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getSlotBooking = (slotId: string) => {
    return dayBookings.find(b => b.courtId === court.id && b.slotId === slotId);
  };

  const displayPrice = isLessonMode ? court.price + INSTRUCTOR_PRICE : court.price;

  const visibleSlots = timeSlots.filter(slot => {
    if (!showAvailableOnly) return true;
    const booking = getSlotBooking(slot.id);
    return !booking;
  });

  if (showAvailableOnly && visibleSlots.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 relative group hover:shadow-xl hover:border-orange-500/20">
      {/* Header */}
      <div className={`p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors ${isLessonMode ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-slate-50/50 dark:bg-slate-700/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${court.type === 'indoor' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300'}`}>
            {court.type === 'indoor' ? <Cloud size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
              {court.name}
              {isLessonMode && (
                <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                  Maestro
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
              <Clock size={12} />
              <span>Sessioni da 90 min</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(displayPrice)}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">a persona</div>
        </div>
      </div>

      {/* Slots Container with Arrows */}
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:flex"
        >
          <div className="p-1.5 rounded-full bg-white dark:bg-slate-700 shadow-md border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
             <ChevronLeft size={20} />
          </div>
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 p-5 no-scrollbar snap-x scroll-pl-4 sm:scroll-pl-12"
        >
          {visibleSlots.map((slot) => {
            const booking = getSlotBooking(slot.id);
            const booked = !!booking;
            const isUnavailable = booking?.status === 'unavailable';
            
            // Logica Dinamica per le classi CSS dello slot
            const getSlotClasses = () => {
              const base = "relative py-4 px-5 rounded-[1.5rem] text-center transition-all duration-300 shrink-0 snap-start min-w-[100px] flex flex-col items-center justify-center gap-1 border-2";
              
              if (isUnavailable) {
                return `${base} bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 border-dashed opacity-60 cursor-not-allowed`;
              }
              
              if (booked) {
                if (isAdmin) {
                  return `${base} border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 hover:shadow-md`;
                }
                return `${base} bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-70`;
              }

              // Slot Libero
              return `${base} bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 active:scale-95 shadow-sm text-slate-900 dark:text-white`;
            };

            return (
              <button
                key={slot.id}
                onClick={() => {
                  if (booked && !isAdmin) {
                    onShowToast(isUnavailable ? 'Campo in manutenzione.' : 'Campo già prenotato.');
                  } else {
                    onSlotClick(court, slot);
                  }
                }}
                className={getSlotClasses()}
              >
                <span className={`text-base font-black tracking-tight leading-none ${isUnavailable ? 'line-through' : ''}`}>
                  {slot.startTime}
                </span>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {slot.endTime}
                </span>
                
                {booked && (
                  <span className={`absolute inset-0 flex items-center justify-center rounded-[1.5rem] ${isUnavailable ? 'bg-red-500/5' : 'bg-transparent'}`}>
                     {isUnavailable ? (
                        <Ban size={22} className="text-red-500/40" />
                     ) : isAdmin ? (
                       <div className="absolute top-1 right-1">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                       </div>
                     ) : (
                       <Lock size={16} className="text-slate-200 dark:text-slate-700" />
                     )}
                  </span>
                )}

                {booked && isAdmin && !isUnavailable && (
                  <span className="mt-1 text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-tighter bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                    Gestisci
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
        >
          <div className="p-1.5 rounded-full bg-white dark:bg-slate-700 shadow-md border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
             <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </div>
  );
};
