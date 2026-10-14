'use client';

import React, { useState } from 'react';

interface LockPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const LockPoliciesModal: React.FC<LockPoliciesModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [emoTolerance, setEmoTolerance] = useState(0);
  const [sctrAlertDays, setSctrAlertDays] = useState(15);
  const [autoLockoutFleet, setAutoLockoutFleet] = useState(true);
  const [inductionRequired, setInductionRequired] = useState(true);

  if (!isOpen) return null;

  const handleApply = () => {
    onShowToast('Reglas de Bloqueo D.S. 024-2016-EM sincronizadas con todas las garitas', 'lock_clock');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-rose-600 dark:text-rose-400">
              lock_clock
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                POLÍTICAS Y REGLAS DE BLOQUEO PREVENTIVO
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Marco Legal D.S. 024-2016-EM • Tolerancias Cero y Semáforo de Riesgo
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

        {/* Informative Banner */}
        <div className="p-3.5 rounded-md bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-300">
          <span className="material-symbols-outlined text-rose-600 text-[20px] flex-shrink-0">
            gavel
          </span>
          <p className="leading-relaxed">
            Las reglas configuradas en este panel rigen el comportamiento de torniquetes, molinetes biométricos y la autorización de flota pesada. Cualquier discrepancia o vencimiento causará <strong>inhabilitación automática de pase</strong> sin intervención manual.
          </p>
        </div>

        {/* Policy Rules Grid */}
        <div className="space-y-3">
          {/* EMO Rule */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium">
                  Examen Médico Ocupacional (Anexo 7C Gran Altura)
                </span>
                <span className="font-mono text-[10px] px-2 py-0.2 rounded-sm bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
                  CRÍTICO
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum block pt-0.5">
                Vigencia de 1 año exacto. Al expirar, revoca inmediatamente el pase de garita.
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
              <span className="text-slate-500 text-[11px]">Tolerancia:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 px-2 py-1 bg-white dark:bg-foundry-abyss rounded-sm border border-slate-300 dark:border-foundry-border">
                {emoTolerance} Días (Cero)
              </span>
            </div>
          </div>

          {/* SCTR Rule */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium">
                  Póliza SCTR Salud y Pensión con Endoso
                </span>
                <span className="font-mono text-[10px] px-2 py-0.2 rounded-sm bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                  PREVENTIVO
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum block pt-0.5">
                Ventana de advertencia antes del vencimiento para tramitar renovación en RRHH.
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
              <span className="text-slate-500 text-[11px]">Alerta previa:</span>
              <input
                type="number"
                min="5"
                max="30"
                value={sctrAlertDays}
                onChange={(e) => setSctrAlertDays(Number(e.target.value))}
                className="w-14 h-8 text-center rounded-sm bg-white dark:bg-foundry-abyss border border-slate-300 dark:border-foundry-border font-bold text-slate-800 dark:text-foundry-titanium"
              />
              <span className="text-slate-500">días</span>
            </div>
          </div>

          {/* Fleet Critical Failure Lockout */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium block">
                Bloqueo Inmediato de Flota por Checklist Pre-Uso Fallido
              </span>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum">
                Cualquier &quot;No Conforme&quot; en frenos, dirección o fugas inhabilita el vehículo en tiempo real
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoLockoutFleet}
                onChange={(e) => setAutoLockoutFleet(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* General Induction */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium block">
                Inducción General y Anexo 4 Vigente
              </span>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum">
                Prohibir acceso a colaboradores sin curso presencial de seguridad certificado
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inductionRequired}
                onChange={(e) => setInductionRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="h-8 px-3.5 rounded-md bg-[#E5484D] hover:bg-[#D9383E] text-white text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Aplicar Políticas de Bloqueo
          </button>
        </div>
      </div>
    </div>
  );
};
