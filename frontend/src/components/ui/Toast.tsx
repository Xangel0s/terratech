'use client';

import React from 'react';

export interface ToastState {
  show: boolean;
  message: string;
  icon?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.show) return null;

  return (
    <div
      id="toast"
      className={`fixed bottom-12 right-6 z-50 px-4 py-3 rounded-md bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-[#EDEDED] shadow-2xl flex items-center gap-3 transition-all transform duration-200 border border-slate-200 dark:border-[#262626] ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-slate-700 dark:text-emerald-400 text-[18px]">
        {toast.icon || 'check_circle'}
      </span>
      <span id="toast-message" className="text-xs font-mono font-medium">{toast.message}</span>
    </div>
  );
};
