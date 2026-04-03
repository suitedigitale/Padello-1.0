import React from 'react';
import { ArrowRight, Star, Trophy } from 'lucide-react';
import { Button } from './Button';
import logoPadello from '../Assets/Images/logo-padello.svg';

interface IntroSlideProps {
  onEnter: () => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1624896740635-c3f2d2595f51?q=80&w=1200&auto=format&fit=crop"
          alt="Padel Court"
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.16),transparent_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-md mx-auto w-full pt-20">
        {/* Logo/Badge */}
        <div className="mb-8 animate-in zoom-in duration-700 fade-in">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/40 overflow-hidden ring-1 ring-white/10">
              <img
                src={logoPadello}
                alt="Padello"
                className="w-[88%] h-[88%] object-contain scale-150"
              />
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-4 mb-10 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-150">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Il Padel <br />
            <span className="text-orange-400 drop-shadow-[0_0_18px_rgba(251,146,60,0.22)]">
              a portata di mano
            </span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto">
            Prenota campi, trova avversari e scala la classifica del tuo club.
            Tutto in un&apos;unica app.
          </p>
        </div>

        {/* Features/Social Proof */}
        <div className="flex justify-center gap-6 mb-10 opacity-0 animate-in fade-in duration-1000 delay-300 fill-mode-forwards">
          <div className="flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1">
            <div className="bg-slate-800/55 p-2.5 rounded-full backdrop-blur-md ring-1 ring-white/5 shadow-lg shadow-black/20">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Top Rated</span>
          </div>

          <div className="flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1">
            <div className="bg-slate-800/55 p-2.5 rounded-full backdrop-blur-md ring-1 ring-white/5 shadow-lg shadow-black/20">
              <Trophy size={16} className="text-orange-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Tornei</span>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full animate-in slide-in-from-bottom-4 duration-700 fade-in delay-500">
          <Button
            fullWidth
            onClick={onEnter}
            className="h-14 text-lg shadow-lg shadow-orange-900/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/40 active:scale-[0.99]"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Scendi in Campo</span>
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Button>

          <p className="mt-4 text-xs text-slate-500">
            Unisciti a oltre 1000 giocatori
          </p>
        </div>
      </div>
    </div>
  );
};