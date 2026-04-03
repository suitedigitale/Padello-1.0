
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Briefcase, Users } from 'lucide-react';
import { Button } from './Button';
import { UserRole } from '../types';
import logoPadello from '../Assets/Images/logo-padello.svg';

interface AuthFormProps {
  onLogin: (email: string, name: string, role?: UserRole) => void;
  onForgotPassword?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onForgotPassword }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) return;

    onLogin(email, isLogin ? (name || email.split('@')[0]) : name, isLogin ? undefined : role);

    if (rememberMe) {
      localStorage.setItem('padello_user_email', email);
      localStorage.setItem('padello_user_name', isLogin ? (name || email.split('@')[0]) : name);
    } else {
      localStorage.removeItem('padello_user_email');
      localStorage.removeItem('padello_user_name');
    }
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
            Padello
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isLogin ? 'Bentornato campione! 👋' : 'Crea il tuo profilo reale 🚀'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-center block">
                  Scegli il tuo ruolo
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('player')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      role === 'player'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                        : 'border-slate-100 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Users size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Giocatore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('manager')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      role === 'manager'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                        : 'border-slate-100 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Briefcase size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gestore</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
                  Nome Completo
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Ettore Fieramosca"
                    required={!isLogin}
                  />
                </div>
              </div>
            </>
          )}

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

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-slate-200 dark:border-slate-700 group-hover:border-orange-300'
                }`}
              >
                {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>

              <input
                type="checkbox"
                className="hidden"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Ricordami
              </span>
            </label>

            {isLogin && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest hover:underline"
              >
                Perso la chiave?
              </button>
            )}
          </div>

          <Button type="submit" fullWidth className="h-14 rounded-2xl mt-4 shadow-xl shadow-orange-500/10">
            <div className="flex items-center justify-center gap-2">
              <span className="font-black uppercase tracking-widest">
                {isLogin ? 'Entra nel Regno' : 'Crea Account'}
              </span>
              <ArrowRight size={20} />
            </div>
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-700/50 pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? 'Non hai ancora un titolo?' : 'Fai già parte del Regno?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-black text-orange-600 dark:text-orange-400 hover:underline focus:outline-none uppercase text-xs tracking-widest"
            >
              {isLogin ? 'Registrati ora' : 'Accedi'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};