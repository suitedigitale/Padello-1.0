import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-slate-800 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-600 animate-in slide-in-from-bottom-5 fade-in duration-300 whitespace-nowrap">
      <AlertCircle size={20} className="text-red-400" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
