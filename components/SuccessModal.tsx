import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl text-center animate-in slide-in-from-bottom-4 duration-300 border border-slate-100 dark:border-slate-700">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ottimo!</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>
        <Button fullWidth onClick={onClose}>
          Ho capito
        </Button>
      </div>
    </div>
  );
};