/// <reference path="../types.d.ts" />
import React, { useState } from 'react';
import { Sun, Moon, LogOut, User as UserIcon, MapPin, Shield, Bell, X } from 'lucide-react';
import { User, Club, PlayerNotification } from '../types.ts';
import { getLevelMetadata } from '../constants.ts';
import logoPadello from '@/Assets/Images/logo-padello.svg';


interface HeaderProps {
  user: User | null;
  selectedClub: Club | null;
  onMyBookingsClick: () => void;
  onAdminDashboardClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onSwitchClub: () => void;
  playerNotifications: PlayerNotification[];
  onMarkNotificationAsRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  selectedClub,
  onAdminDashboardClick,
  isDarkMode,
  toggleDarkMode,
  onLogout,
  onEditProfile,
  onSwitchClub,
  playerNotifications,
  onMarkNotificationAsRead
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = playerNotifications.filter(n => !n.isRead).length;

  const levelMeta = user ? getLevelMetadata(user.rating) : null;

  return (
    <header className="sticky top-0 z-[110] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoPadello}
              alt="Padello"
              className="h-11 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                PADELLO
              </h1>
              {selectedClub && (
                <button
                  onClick={onSwitchClub}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
                >
                  <MapPin size={10} />
                  {selectedClub.name}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                  {user.name}
                </span>
                {levelMeta && (
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${levelMeta.text}`}>
                    {levelMeta.label}
                  </span>
                )}
              </div>

              <div className="relative group" onClick={onEditProfile}>
                <button className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 overflow-hidden">
                  <UserIcon size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (user.role === 'super_admin' || user.role === 'manager') && (
              <button
                onClick={onAdminDashboardClick}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                title="Dashboard Admin"
              >
                <Shield size={20} />
              </button>
            )}

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 dark:text-slate-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {isNotificationsOpen && (
        <div className="absolute top-full right-4 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Notifiche</h3>
            <button onClick={() => setIsNotificationsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
            {playerNotifications.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8 italic">Nessuna notifica</p>
            ) : (
              playerNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    n.isRead
                      ? 'bg-slate-50 dark:bg-slate-900/50 border-transparent'
                      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800'
                  }`}
                  onClick={() => onMarkNotificationAsRead(n.id)}
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                    {n.title}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
};