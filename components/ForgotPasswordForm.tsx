import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from './Button';
import logoPadello from '../Assets/Images/logo-padello.svg';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSend: (email: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onSend }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSend(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20 overflow-hidden">
            <img
              src={logoPadello}
              alt="Padello"
              className="w-[88%] h-[88%] object-contain scale-150"
            />
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            Recupera Password
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Inserisci la tua email e ti invieremo le istruzioni per rientrare nel Regno 🔑
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="nome@esempio.com"
                required
              />
            </div>
          </div>

          <Button type="submit" fullWidth className="h-14 rounded-2xl mt-4 shadow-xl shadow-orange-500/10">
            <div className="flex items-center justify-center gap-2">
              <span className="font-black uppercase tracking-widest">Invia Istruzioni</span>
              <Send size={18} />
            </div>
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-700/50 pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Torna al Login
          </button>
        </div>
      </div>
    </div>
  );
};