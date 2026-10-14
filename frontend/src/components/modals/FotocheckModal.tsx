'use client';

import React, { useState } from 'react';
import { WorkerProfile } from '@/types';

interface FotocheckModalProps {
  isOpen: boolean;
  worker: WorkerProfile | null;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const FotocheckModal: React.FC<FotocheckModalProps> = ({
  isOpen,
  worker,
  onClose,
  onShowToast,
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  if (!isOpen || !worker) return null;

  const isApto = worker.status === 'apto';
  const isBloqueado = worker.status === 'bloqueado';

  const handlePrint = () => {
    onShowToast(`Enviando Fotocheck CR-80 de ${worker.fullName} a la impresora térmica de credenciales...`, 'print');
  };

  const handleDownload = () => {
    onShowToast(`Fotocheck digital FOTOCHECK_${worker.dni}.png descargado`, 'download_done');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              badge
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                FOTOCHECK INDUSTRIAL DE ACCESO
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Credencial PVC CR-80 con Chip RFID y Código QR de Garita
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-foundry-titanium p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-foundry-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSide('front')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              side === 'front'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-none'
                : 'bg-transparent text-slate-600 dark:text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
            }`}
            type="button"
          >
            Anverso (Frente)
          </button>
          <button
            onClick={() => setSide('back')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              side === 'back'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-none'
                : 'bg-transparent text-slate-600 dark:text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
            }`}
            type="button"
          >
            Reverso (Dorso / SCTR)
          </button>
        </div>

        {/* Badge Card Representation */}
        <div className="flex justify-center py-2">
          {side === 'front' ? (
            /* FRONT BADGE */
            <div className="w-72 h-[410px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white p-4 shadow-xl border-2 border-slate-700 flex flex-col justify-between relative overflow-hidden">
              {/* Lanyard punch hole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-950 rounded-full border border-slate-600"></div>

              {/* Badge Brand Header */}
              <div className="flex items-center justify-between pt-3 pb-1 border-b border-slate-700/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-amber-500 text-slate-900 flex items-center justify-center font-black text-[10px]">
                    T
                  </div>
                  <span className="font-mono font-bold text-xs tracking-wider text-amber-400">
                    TERRATECH
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  U.M. QUELLAVECO
                </span>
              </div>

              {/* Photo & RFID Chip */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="relative">
                  {worker.avatarUrl ? (
                    <img
                      src={worker.avatarUrl}
                      alt={worker.fullName}
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-amber-400 border-2 border-slate-900 shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-2xl ${worker.avatarBg} ${worker.avatarColor} ring-2 ring-amber-400 flex items-center justify-center font-mono font-bold text-2xl shadow-md`}
                    >
                      {worker.avatarInitials}
                    </div>
                  )}
                  {/* RFID Contactless Icon */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-amber-400 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">contactless</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {worker.fullName}
                  </h4>
                  <span className="font-mono text-[11px] text-slate-300 font-semibold block pt-0.5">
                    DNI {worker.dni}
                  </span>
                  <span className="text-[11px] text-amber-400 font-sans font-medium">
                    {worker.role}
                  </span>
                </div>
              </div>

              {/* Metadata details */}
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Cuadrilla:</span>
                  <span className="text-white font-semibold">{worker.cuadrilla}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Régimen:</span>
                  <span className="text-white font-semibold">{worker.guardia}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Fotocheck:</span>
                  <span className="text-amber-400 font-bold">#{worker.fotocheck}</span>
                </div>
              </div>

              {/* Bottom Clearance Bar */}
              <div
                className={`py-1.5 px-3 rounded-xl font-mono text-[11px] font-bold text-center uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                  isApto
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_#10b981]'
                    : isBloqueado
                    ? 'bg-rose-600 text-white shadow-[0_0_12px_#ef4444]'
                    : 'bg-amber-500 text-slate-950 shadow-[0_0_12px_#f59e0b]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {isApto ? 'PASE AUTORIZADO 4,200M' : isBloqueado ? 'ACCESO DENEGADO' : 'ACCESO OBSERVADO'}
              </div>
            </div>
          ) : (
            /* BACK BADGE */
            <div className="w-72 h-[410px] rounded-2xl bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-900 p-4 shadow-xl border-2 border-slate-300 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-300 rounded-full border border-slate-400"></div>

              {/* SCTR & Medical Info */}
              <div className="pt-4 flex flex-col gap-2">
                <div className="text-center pb-2 border-b border-slate-200">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
                    CONSTRUCTORA ANDINA S.A.
                  </span>
                  <span className="font-bold text-xs text-slate-800">
                    CONTRATO MARCO ANGLO AMERICAN
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">PÓLIZA SCTR SALUD / PENSIÓN:</span>
                    <span className="font-bold text-slate-800">RIMAC SEGUROS #99214081-1</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Endosada a favor de Anglo American</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">GRUPO SANGUÍNEO &amp; ALERGIAS:</span>
                    <span className="font-bold text-rose-700">O RH(+) POSITIVO • NKDA</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">CENTRO MÉDICO QUELLAVECO:</span>
                    <span className="font-bold text-slate-800 font-mono">+51 053-584000 (Anexo 402)</span>
                  </div>
                </div>
              </div>

              {/* QR Code Simulation & Legal Warning */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[32px]">qr_code_2</span>
                </div>
                <div className="flex-1 text-[9px] text-slate-500 font-sans leading-tight">
                  Este fotocheck es personal e intransferible. Debe portarse en lugar visible durante toda la permanencia en faena.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              Imprimir
            </button>
            <button
              onClick={handleDownload}
              className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Descargar
            </button>
          </div>
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
