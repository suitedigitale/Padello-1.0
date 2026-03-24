import React, { useState, useEffect } from 'react';
import { X, CalendarDays, Trash2, ArrowRightLeft, Save, RotateCcw, User, CheckCircle, Pencil, Ban, Construction } from 'lucide-react';
import { Booking, BookingStatus, Court, TimeSlot } from '../types';
import { Button } from './Button';
import { formatCurrency } from '../constants';

interface AdminManageModalProps {
  booking: Booking;
  court: Court;
  slot: TimeSlot;
  racketPrice: number;
  instructorPrice: number;
  onClose: () => void;
  onDelete: () => void;
  onMoveStart: () => void;
  onUpdate: (data: { price: number; extras: { rackets: number; instructor: boolean }; status: BookingStatus; playerName: string }) => void;
  onShowToast: (message: string) => void;
}

export const AdminManageModal: React.FC<AdminManageModalProps> = ({ 
  booking, 
  court, 
  slot,
  racketPrice,
  instructorPrice,
  onClose, 
  onDelete,
  onMoveStart,
  onUpdate,
  onShowToast
}) => {
  const [rackets, setRackets] = useState(booking.extras.rackets);
  const [instructor, setInstructor] = useState(booking.extras.instructor);
  const [price, setPrice] = useState(booking.totalPrice);
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [playerName, setPlayerName] = useState(booking.playerName || '');
  const [isDirty, setIsDirty] = useState(false);

  // Calculate standard price based on current selection
  const standardPrice = court.price + (rackets * racketPrice) + (instructor ? instructorPrice : 0);
  const isPriceCustom = price !== standardPrice;
  const isUnavailable = status === 'unavailable';

  useEffect(() => {
    // Check if any value is different from original booking
    const hasChanges = 
      rackets !== booking.extras.rackets || 
      instructor !== booking.extras.instructor || 
      price !== booking.totalPrice ||
      status !== booking.status ||
      playerName !== (booking.playerName || '');
    
    setIsDirty(hasChanges);
  }, [rackets, instructor, price, status, playerName, booking]);

  const handleRecalculate = () => {
    if (isUnavailable) return;
    setPrice(standardPrice);
  };

  const handleSave = () => {
    onUpdate({
      price,
      extras: { rackets, instructor },
      status,
      playerName
    });
  };

  const handleClose = () => {
    if (isDirty) {
      onShowToast("Hai modifiche non salvate! Salva prima di chiudere.");
      return;
    }
    onClose();
  };

  const toggleStatus = () => {
    if (isUnavailable) return;
    setStatus(prev => prev === 'pending_payment' ? 'confirmed' : 'pending_payment');
  };

  const toggleUnavailable = () => {
    if (status === 'unavailable') {
      // Revert to confirmed standard
      setStatus('confirmed');
      setPlayerName(booking.playerName === 'MANUTENZIONE' ? 'Admin' : booking.playerName || 'Admin');
      setPrice(standardPrice); // Reset price to calculation
    } else {
      // Set to unavailable
      setStatus('unavailable');
      setPlayerName('MANUTENZIONE');
      setPrice(0);
      setRackets(0);
      setInstructor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Admin Mode</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestisci Prenotazione</h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-6 flex items-center gap-3">
          <CalendarDays className="text-slate-400 shrink-0" size={20} />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{court.name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {slot.startTime} - {slot.endTime} • {booking.paymentMethod === 'paypal' ? 'PayPal' : 'In Circolo'}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className={`space-y-4 mb-6 transition-opacity ${isUnavailable ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Modifica Dettagli</h3>
          
          {/* Player Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Nome Giocatore</label>
            <div className="relative">
              <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                disabled={isUnavailable}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium disabled:opacity-70"
                placeholder="Nome giocatore..."
              />
            </div>
          </div>

          {/* Status Control */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-medium text-slate-900 dark:text-white text-sm">Stato Pagamento</div>
              <div className={`text-xs font-bold ${status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status === 'confirmed' ? 'CONFERMATO' : 'DA SALDARE'}
              </div>
            </div>
            
            {status === 'pending_payment' ? (
              <button
                onClick={toggleStatus}
                disabled={isUnavailable}
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <CheckCircle size={14} />
                SEGNA PAGATO
              </button>
            ) : (
              <button
                 onClick={toggleStatus}
                 disabled={isUnavailable}
                 className="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Annulla
              </button>
            )}
          </div>

          {/* Instructor */}
          <div 
            onClick={() => !isUnavailable && setInstructor(!instructor)}
            className={`
              flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
              ${instructor 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-full ${instructor ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                <User size={18} />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white text-sm">Lezione col Maestro</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">+{formatCurrency(instructorPrice)}</div>
              </div>
            </div>
            {instructor && <CheckCircle size={18} className="text-emerald-500" />}
          </div>

          {/* Rackets */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-medium text-slate-900 dark:text-white text-sm">Noleggio Pale</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">+{formatCurrency(racketPrice)} cad.</div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button 
                onClick={() => setRackets(Math.max(0, rackets - 1))}
                disabled={isUnavailable || rackets === 0}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-600 rounded shadow-sm text-slate-600 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 font-bold disabled:opacity-50"
              >
                -
              </button>
              <span className="w-4 text-center font-medium text-slate-900 dark:text-white text-sm">{rackets}</span>
              <button 
                onClick={() => setRackets(Math.min(4, rackets + 1))}
                disabled={isUnavailable}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-600 rounded shadow-sm text-slate-600 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Prezzo Totale (€)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={isUnavailable}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-70"
              />
              <button
                onClick={handleRecalculate}
                disabled={!isPriceCustom || isUnavailable}
                title="Ricalcola prezzo standard"
                className="px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Unavailable Toggle */}
        <div className="mb-6">
           <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">Manutenzione</h3>
           <button
            onClick={toggleUnavailable}
            className={`w-full p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${
              isUnavailable 
              ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-600 dark:border-slate-600' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
           >
             {isUnavailable ? (
               <>
                 <Construction size={18} />
                 <span>CAMPO IN MANUTENZIONE (SBLOCCA)</span>
               </>
             ) : (
               <>
                 <Ban size={18} />
                 <span>SEGNA COME NON DISPONIBILE</span>
               </>
             )}
           </button>
           <p className="text-[10px] text-slate-400 mt-1 text-center">
             Bloccando il campo, il prezzo verrà impostato a 0€ e il nome a "MANUTENZIONE".
           </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isDirty && (
            <Button fullWidth onClick={handleSave} className="animate-in slide-in-from-bottom-2 fade-in">
              <div className="flex items-center justify-center gap-2">
                <Save size={18} />
                <span>Salva Modifiche</span>
              </div>
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" onClick={onMoveStart}>
              <div className="flex items-center justify-center gap-2">
                <ArrowRightLeft size={16} />
                <span className="text-sm">Sposta (Data/Ora)</span>
              </div>
            </Button>
            <Button variant="danger" onClick={onDelete}>
              <div className="flex items-center justify-center gap-2">
                <Trash2 size={16} />
                <span className="text-sm">Cancella</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};