'use client';

import React, { useState } from 'react';

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'ssoma' | 'fleet' | 'dashboard' | 'personnel') => void;
  onShowToast: (message: string, icon?: string) => void;
}

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timeAgo: string;
  targetTab?: 'ssoma' | 'fleet' | 'dashboard' | 'personnel';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'critical',
    title: 'Parada Crítica: Volquete VOL-108 Bloqueado',
    description: 'Inspección Pre-Uso detectó fuga mayor de aceite hidráulico en dirección. Motor deshabilitado preventivamente.',
    timeAgo: 'Hace 14 min',
    targetTab: 'fleet',
    read: false,
  },
  {
    id: 'n-2',
    type: 'warning',
    title: 'Vencimiento Inminente: Roberto Arteaga Ramos',
    description: 'Certificado Médico Ocupacional (Anexo 7C) entra en ventana de caducidad en 12 días. Coordinar cita en clínica.',
    timeAgo: 'Hace 45 min',
    targetTab: 'ssoma',
    read: false,
  },
  {
    id: 'n-3',
    type: 'warning',
    title: 'Endoso SCTR Pendiente: Javier Paredes Silva',
    description: 'Póliza SCTR Rimac requiere confirmación de endoso a favor de Anglo American Quellaveco antes de fin de mes.',
    timeAgo: 'Hace 2 horas',
    targetTab: 'ssoma',
    read: false,
  },
  {
    id: 'n-4',
    type: 'success',
    title: 'Enlace Garita Quellaveco 4,200m Operativo',
    description: 'Cola Outbox reconciliada al 100%. Protocolo de validación biométrica respondiendo en <120ms.',
    timeAgo: 'Hace 3 horas',
    targetTab: 'dashboard',
    read: true,
  },
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onShowToast,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onShowToast('Todas las alertas marcadas como atendidas', 'mark_email_read');
  };

  const handleAction = (tab?: 'ssoma' | 'fleet' | 'dashboard' | 'personnel') => {
    if (tab) {
      onNavigateTab(tab);
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-[390px] z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* Puntero de burbuja apuntando directamente al icono de campanita */}
      <div className="absolute -top-1.5 right-2.5 w-3 h-3 bg-white dark:bg-[#0A0A0A] border-t border-l border-slate-200 dark:border-[#262626] rotate-45 z-10" />

      {/* Contenedor Dropdown estilo Vercel Geist */}
      <div className="relative bg-white dark:bg-[#0A0A0A] rounded-lg shadow-2xl border border-slate-200 dark:border-[#262626] flex flex-col overflow-hidden font-mono">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-slate-500 dark:text-[#888888]">
              notifications
            </span>
            <div>
              <h3 className="font-mono text-xs font-semibold text-slate-900 dark:text-[#EDEDED] leading-none">
                CENTRO DE NOTIFICACIONES Y DESPACHO
              </h3>
              <p className="font-mono text-[10px] text-slate-500 dark:text-[#888888] pt-1 leading-none">
                {unreadCount > 0 ? `${unreadCount} alertas no atendidas` : 'Todas las alertas al día'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
            type="button"
            title="Cerrar notificaciones"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Lista de Notificaciones */}
        <div className="flex flex-col gap-1.5 p-2 max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            let dotColor = 'bg-slate-400';
            if (n.type === 'critical') dotColor = 'bg-rose-500';
            else if (n.type === 'warning') dotColor = 'bg-amber-500';
            else if (n.type === 'success') dotColor = 'bg-emerald-500';

            return (
              <div
                key={n.id}
                className={`p-2.5 rounded-md border transition-colors ${
                  n.read
                    ? 'border-transparent bg-transparent opacity-60'
                    : 'border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-black'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0 mt-1.5`} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono font-medium text-xs text-slate-900 dark:text-[#EDEDED] leading-tight">
                        {n.title}
                      </span>
                      <p className="font-mono text-[11px] text-slate-500 dark:text-[#888888] leading-normal pt-1">
                        {n.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#666666] whitespace-nowrap flex-shrink-0">
                    {n.timeAgo}
                  </span>
                </div>

                {n.targetTab && (
                  <div className="flex justify-end pt-1.5">
                    <button
                      onClick={() => handleAction(n.targetTab)}
                      className="font-mono text-[11px] text-[#888888] hover:text-white transition-colors flex items-center gap-1 font-medium"
                      type="button"
                    >
                      <span>Ir al módulo ({n.targetTab.toUpperCase()})</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-[#1F1F1F] bg-slate-50/50 dark:bg-black">
          <button
            onClick={markAllAsRead}
            className="font-mono text-[11px] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white transition-colors"
            type="button"
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={onClose}
            className="h-7 px-2.5 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] font-mono text-xs transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationsDropdown = NotificationsModal;
