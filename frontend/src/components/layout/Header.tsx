'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '@/services/audioService';
import { NotificationsModal } from '@/components/modals/NotificationsModal';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  isCollapsed: boolean;
  onSyncClick: () => void;
  onNotificationClick: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  onOpenCommandPalette?: () => void;
  isNotificationsOpen?: boolean;
  onCloseNotifications?: () => void;
  onNavigateTab?: (tab: 'ssoma' | 'fleet' | 'dashboard' | 'personnel') => void;
  onShowToast?: (message: string, icon?: string) => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  onOpenMobileSidebar,
  isCollapsed,
  onSyncClick,
  onNotificationClick,
  isOnline,
  pendingSyncCount,
  onOpenCommandPalette,
  isNotificationsOpen = false,
  onCloseNotifications,
  onNavigateTab,
  onShowToast,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        onCloseNotifications?.();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseNotifications?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationsOpen, onCloseNotifications]);

  useEffect(() => {
    // Sincronizar estado inicial desde el DOM / localStorage
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    setIsAudioMuted(audio.getIsMuted());
  }, []);

  const toggleAudio = () => {
    const nextMuted = audio.toggleMute();
    setIsAudioMuted(nextMuted);
    if (!nextMuted) {
      audio.playBeep(900, 0.05);
    }
  };

  const toggleConsoleMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('terratech-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('terratech-theme', 'light');
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-[#262626] z-40 flex items-center justify-between px-3 sm:px-6 transition-[left] duration-150 ease-out will-change-[left] left-0 ${
        isCollapsed ? 'lg:left-[4.5rem]' : 'lg:left-64'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger menu toggle */}
        <button
          aria-label="Abrir menú de navegación"
          className="lg:hidden w-8 h-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors flex-shrink-0 border border-slate-200 dark:border-[#262626] active:scale-95"
          onClick={onOpenMobileSidebar}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>

        {/* Vercel Clean Breadcrumb: Constructora Andina / U.M. Quellaveco */}
        <div className="flex items-center gap-2 text-xs font-sans min-w-0">
          <span className="text-slate-500 dark:text-[#888888] font-medium truncate">
            Constructora Andina
          </span>
          <span className="text-slate-300 dark:text-[#404040]">/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate">
            U.M. Quellaveco (4,200 m)
          </span>
          <span className="hidden xl:inline text-slate-300 dark:text-[#404040]">/</span>
          <span className="hidden xl:inline font-mono text-[11px] text-slate-400 dark:text-[#666666] truncate">
            D.S. 024-2016-EM / OSINERGMIN
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Server Sync Status: Texto compacto con micro-punto indicador */}
        <div
          className="hidden md:flex items-center gap-2 text-xs font-sans text-slate-500 dark:text-[#888888]"
          title={isOnline ? "Servidor sincronizado con Anglo American SSOMA Central" : "Modo offline: eventos guardados en IndexedDB local"}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span className="hidden lg:inline text-xs text-slate-600 dark:text-[#888888]">
            {isOnline
              ? 'Servidor Sincronizado: Anglo American SSOMA'
              : `Offline: ${pendingSyncCount} en cola local`}
          </span>
          <span className="lg:hidden text-xs">{isOnline ? 'En línea' : 'Offline'}</span>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
          {/* Command Palette Launcher Pill (Vercel Style) */}
          <button
            aria-label="Abrir Paleta de Comandos (Ctrl+K)"
            className="hidden sm:flex h-8 items-center gap-2 px-2.5 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-[#262626] active:scale-95 text-xs font-sans"
            onClick={onOpenCommandPalette}
            title="Abrir Paleta de Comandos Táctica (Ctrl + K)"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-current">
              terminal
            </span>
            <span className="font-medium hidden md:inline text-xs">Comandos</span>
            <kbd className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1A1A1A] text-[10px] text-slate-500 dark:text-[#888888] font-mono border border-slate-200 dark:border-[#262626]">
              Ctrl+K
            </kbd>
          </button>

          {/* Audio Synthesizer (Mute / Unmute) */}
          <button
            aria-label="Alternar Audio Industrial"
            className="w-8 h-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200 dark:border-[#262626] active:scale-95"
            onClick={toggleAudio}
            title={isAudioMuted ? "Activar audio industrial Web Audio API" : "Silenciar audio industrial"}
            type="button"
          >
            <span className={`material-symbols-outlined text-[17px] ${isAudioMuted ? 'text-slate-400 dark:text-[#555555]' : 'text-current'}`}>
              {isAudioMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Console Mode (Dark / Light) Switcher */}
          <button
            aria-label="Alternar Modo Consola de Despacho"
            className="w-8 h-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200 dark:border-[#262626] active:scale-95"
            onClick={toggleConsoleMode}
            title={isDarkMode ? "Cambiar a Modo Plano Técnico (Blanco)" : "Cambiar a Modo Consola de Despacho (Oscuro)"}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notificaciones (Dropdown Bubble) */}
          <div className="relative" ref={notificationsRef}>
            <button
              aria-label="Notificaciones"
              className={`relative w-8 h-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200 dark:border-[#262626] active:scale-95 ${
                isNotificationsOpen ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white border-[#404040]' : ''
              }`}
              onClick={onNotificationClick}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                notifications
              </span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>

            {/* Burbuja Dropdown */}
            {isNotificationsOpen && (
              <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={onCloseNotifications || (() => {})}
                onNavigateTab={onNavigateTab || (() => {})}
                onShowToast={onShowToast || (() => {})}
              />
            )}
          </div>

          {/* Sincronizar */}
          <button
            aria-label="Sincronizar datos con servidor"
            className="relative w-8 h-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200 dark:border-[#262626] active:scale-95"
            onClick={onSyncClick}
            title="Sincronizar base local IndexedDB con servidor"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            {pendingSyncCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 bg-white text-black rounded-sm text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
