'use client';

import React from 'react';
import { WorkerProfile } from '@/types';

interface MedicalRecordModalProps {
  isOpen: boolean;
  worker: WorkerProfile | null;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  worker,
  onClose,
  onShowToast,
}) => {
  if (!isOpen || !worker) return null;

  const isApto = worker.status === 'apto';
  const isBloqueado = worker.status === 'bloqueado';

  const handlePrint = () => {
    onShowToast(`Enviando Ficha Médica Anexo 7C de ${worker.fullName} a la impresora...`, 'print');
  };

  const handleDownloadPdf = () => {
    onShowToast(`Certificado EMO_ANEXO_7C_${worker.dni}.pdf descargado con firma digital MINSA`, 'download_done');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-emerald-600 dark:text-emerald-400">
              health_and_safety
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                FICHA MÉDICA OCUPACIONAL • ANEXO 7C (D.S. 024-2016-EM)
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Evaluación Médica de Gran Altura Geográfica (&gt; 4,000 msnm)
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

        {/* Worker & Clinic Bio Capsule */}
        <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {worker.avatarUrl ? (
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/80 border border-white dark:border-foundry-panel shadow-xs flex-shrink-0"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full ${worker.avatarBg} ${worker.avatarColor} ring-2 ring-emerald-500/80 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 shadow-xs`}
              >
                {worker.avatarInitials}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h4 className="font-bold text-sm text-slate-900 dark:text-foundry-titanium truncate">
                {worker.fullName}
              </h4>
              <span className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                DNI {worker.dni} • Cargo: {worker.role}
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-mono">
                {worker.cuadrilla} • Guardia: {worker.guardia}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 font-mono text-xs">
            <span className="font-bold text-slate-700 dark:text-foundry-titanium">
              {worker.clinic || 'Clínica San José de Moquegua'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum">
              RUC 20451928301 • Aut. DIGESA N° 419-2024
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              Dr. Carlos Mendoza Alva • CMP 45192 / RNE 23981
            </span>
          </div>
        </div>

        {/* Aptitude Result Pill */}
        <div
          className={`p-3 rounded-md border flex items-center justify-between ${
            isApto
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300'
              : isBloqueado
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px]">
              {isApto ? 'verified' : isBloqueado ? 'dangerous' : 'warning'}
            </span>
            <div>
              <span className="font-bold text-xs uppercase block font-mono">
                DIAGNÓSTICO DE APTITUD OCUPACIONAL:
              </span>
              <span className="text-xs sm:text-sm font-black">
                {isApto
                  ? 'APTO PARA TRABAJOS EN GRAN ALTURA (> 4,000 MSNM)'
                  : isBloqueado
                  ? 'NO APTO / ACCESO SUSPENDIDO POR VENCIMIENTO'
                  : 'APTO CON OBSERVACIONES / REQUERIMIENTO PRÓXIMO'}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-white/80 dark:bg-foundry-abyss border border-current">
            {worker.statusLabel || worker.status.toUpperCase()}
          </span>
        </div>

        {/* Clinical Exams Protocol */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-foundry-aluminum uppercase">
            Protocolo Médico Realizado (Batería Anexo 7C):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Oximetría en Reposo:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">SatO2: 94% (Óptimo)</span>
            </div>
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Presión Arterial:</span>
              <span className="font-bold text-slate-800 dark:text-foundry-titanium">115 / 75 mmHg</span>
            </div>
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Audiometría Tonal:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Normal Bilateral</span>
            </div>
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Espirometría FVC:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">98% de Capacidad</span>
            </div>
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Electrocardiograma:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Ritmo Sinusal Normal</span>
            </div>
            <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex justify-between items-center">
              <span className="text-slate-600 dark:text-foundry-aluminum">Agudeza Visual:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">20/20 (Con Corrección)</span>
            </div>
          </div>
        </div>

        {/* Restrictions Box */}
        <div className="p-3 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono">
            Restricciones Ocupacionales Indicadas por Médico Evaluador:
          </span>
          <span className="text-slate-700 dark:text-foundry-aluminum pt-0.5 block">
            • Uso permanente de lentes correctivos de seguridad con luna de policarbonato durante toda la jornada.
            <br />• Mantener hidratación adecuada por permanencia en cota superior a 4,200 msnm.
          </span>
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
              onClick={handleDownloadPdf}
              className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Descargar PDF Oficial
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
