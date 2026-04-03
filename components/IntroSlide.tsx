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
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-md mx-auto w-full pt-20">
        {/* Logo/Badge */}
        <div className="mb-8 animate-in zoom-in duration-700 fade-in">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30">
            <img src={logoPadello} alt="Padello" className="w-12 h-12 object-contain" />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-4 mb-10 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-150">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Il Padel <br />
            <span className="text-orange-400">a portata di mano</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Prenota campi, trova avversari e scala la classifica del tuo club. Tutto in un&apos;unica app.
          </p>
        </div>

        {/* Features/Social Proof */}
        <div className="flex justify-center gap-6 mb-10 opacity-0 animate-in fade-in duration-1000 delay-300 fill-mode-forwards">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-xs font-medium text-slate-400">Top Rated</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
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
            className="h-14 text-lg shadow-lg shadow-orange-900/50"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Scendi in Campo</span>
              <ArrowRight size={20} />
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