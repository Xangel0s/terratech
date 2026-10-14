'use client';

import React from 'react';
import { WorkerProfile } from '@/types';

interface GatePassAuditModalProps {
  isOpen: boolean;
  worker: WorkerProfile | null;
  onClose: () => void;
  onConfirmEntry: (workerName: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const GatePassAuditModal: React.FC<GatePassAuditModalProps> = ({
  isOpen,
  worker,
  onClose,
  onConfirmEntry,
  onShowToast,
}) => {
  if (!isOpen || !worker) return null;

  const handleRegisterPass = () => {
    onConfirmEntry(worker.fullName);
    onShowToast(`Pase de garita validado y registrado en Bitácora para ${worker.fullName}`, 'verified_user');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-emerald-500">
              verified_user
            </span>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#EDEDED]">
                Auditoría de pase en garita en vivo
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888]">
                Garita Km 34 • Torniquete Alfa #01 • Cota 4,200m
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-[#666666] dark:hover:text-[#EDEDED] p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Worker Summary Capsule */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex items-center gap-3.5">
          {worker.avatarUrl ? (
            <img
              src={worker.avatarUrl}
              alt={worker.fullName}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-[#262626] flex-shrink-0"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-full ${worker.avatarBg} ${worker.avatarColor} border border-slate-200 dark:border-[#262626] flex items-center justify-center font-sans font-medium text-xs flex-shrink-0`}
            >
              {worker.avatarInitials}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h4 className="font-medium text-sm text-slate-900 dark:text-[#EDEDED] truncate font-sans">
              {worker.fullName}
            </h4>
            <span className="text-xs text-slate-500 dark:text-[#888888]">
              DNI {worker.dni} • Fotocheck #{worker.fotocheck}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-[#888888] font-medium">
              {worker.role} • {worker.cuadrilla}
            </span>
          </div>
        </div>

        {/* Real-time Turnstile Clearance Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-700 dark:text-[#EDEDED]">
            Verificación automática de requisitos de acceso:
          </span>
          <div className="space-y-1.5 text-xs font-sans">
            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Examen Médico Ocupacional (Anexo 7C)
              </span>
              <span className="font-medium font-mono text-[11px]">CONFORME</span>
            </div>

            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Póliza SCTR Salud y Pensión con Endoso
              </span>
              <span className="font-medium font-mono text-[11px]">CONFORME</span>
            </div>

            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Inducción General Quellaveco (Anexo 04)
              </span>
              <span className="font-medium font-mono text-[11px]">HOMOLOGADO</span>
            </div>

            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Alcoholemia en Garita (Sensor Óptico)
              </span>
              <span className="font-medium font-mono text-[11px]">0.00 mg/L (OK)</span>
            </div>
          </div>
        </div>

        {/* Turnstile Physical Release Banner */}
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center flex flex-col items-center justify-center gap-0.5">
          <span className="font-medium text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">sensor_door</span>
            SOLENOIDE TORNIQUETE LIBERADO
          </span>
          <span className="text-[11px] text-emerald-400/80">
            Paso habilitado por 15 segundos • Acceso concedido a interior mina
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            type="button"
          >
            Cerrar
          </button>
          <button
            onClick={handleRegisterPass}
            className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            Registrar Ingreso en Bitácora
          </button>
        </div>
      </div>
    </div>
  );
};
