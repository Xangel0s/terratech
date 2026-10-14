'use client';

import React, { useState } from 'react';

interface GaritaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const GaritaSettingsModal: React.FC<GaritaSettingsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [rfidTimeout, setRfidTimeout] = useState(15);
  const [requireAlcoholSensor, setRequireAlcoholSensor] = useState(true);
  const [biometricStrict, setBiometricStrict] = useState(true);
  const [guardRegime, setGuardRegime] = useState('14x7');
  const [activeTurnstiles, setActiveTurnstiles] = useState({
    alfa: true,
    bravo: true,
    charlie: true,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onShowToast('Parámetros de Garita y Torniquetes transmitidos al hardware local (Garita 4,200m)', 'sensors');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              sensors
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                CONFIGURACIÓN DE GARITA &amp; TORNIQUETES
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Control de Acceso Físico • Torniquetes Quellaveco Cota 4,200m
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

        {/* Turnstiles List */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Estado de Molinetes y Torniquetes Físicos
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Torniquete Alfa */}
            <div className="p-3 rounded-md border border-slate-200 dark:border-foundry-border bg-slate-50/50 dark:bg-foundry-surface flex flex-col gap-2 shadow-hardware">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-slate-900 dark:text-foundry-titanium">
                  TORNIQUETE ALFA
                </span>
                <input
                  type="checkbox"
                  checked={activeTurnstiles.alfa}
                  onChange={(e) => setActiveTurnstiles({ ...activeTurnstiles, alfa: e.target.checked })}
                  className="rounded text-foundry-blue focus:ring-foundry-blue w-4 h-4 accent-[#106ba3]"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum font-sans">
                Garita Principal Mina
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ONLINE 100%
              </span>
            </div>

            {/* Torniquete Bravo */}
            <div className="p-3 rounded-md border border-slate-200 dark:border-foundry-border bg-slate-50/50 dark:bg-foundry-surface flex flex-col gap-2 shadow-hardware">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-slate-900 dark:text-foundry-titanium">
                  TORNIQUETE BRAVO
                </span>
                <input
                  type="checkbox"
                  checked={activeTurnstiles.bravo}
                  onChange={(e) => setActiveTurnstiles({ ...activeTurnstiles, bravo: e.target.checked })}
                  className="rounded text-foundry-blue focus:ring-foundry-blue w-4 h-4 accent-[#106ba3]"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum font-sans">
                Acceso a Tajo Abierto
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ONLINE 100%
              </span>
            </div>

            {/* Torniquete Charlie */}
            <div className="p-3 rounded-md border border-slate-200 dark:border-foundry-border bg-slate-50/50 dark:bg-foundry-surface flex flex-col gap-2 shadow-hardware">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-slate-900 dark:text-foundry-titanium">
                  TORNIQUETE CHARLIE
                </span>
                <input
                  type="checkbox"
                  checked={activeTurnstiles.charlie}
                  onChange={(e) => setActiveTurnstiles({ ...activeTurnstiles, charlie: e.target.checked })}
                  className="rounded text-foundry-blue focus:ring-foundry-blue w-4 h-4 accent-[#106ba3]"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum font-sans">
                Planta Concentradora
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ONLINE 100%
              </span>
            </div>
          </div>
        </div>

        {/* Operating parameters */}
        <div className="space-y-3 pt-2">
          {/* Timeout */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Ventana de Paso Tras Lectura NFC / Fotocheck
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Tiempo que el solenoide del torniquete permanece liberado antes de re-bloquear
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="number"
                min="5"
                max="60"
                value={rfidTimeout}
                onChange={(e) => setRfidTimeout(Number(e.target.value))}
                className="w-16 h-8 text-center rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-100"
              />
              <span className="text-slate-500">seg</span>
            </div>
          </div>

          {/* Alcohol Test */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Examen de Alcoholemia Aleatorio Obligatorio
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                D.S. 024-2016-EM: Bloqueo inmediato ante detección &gt; 0.00 mg/L
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requireAlcoholSensor}
                onChange={(e) => setRequireAlcoholSensor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Biometric Strict */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Validación Facial / Huella Biométrica Estricta
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Impide ingreso de colaboradores sin escaneo biométrico registrado
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometricStrict}
                onChange={(e) => setBiometricStrict(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Guardia Regime */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Régimen Laboral Minero Activo
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Control de relevos y días acumulados de permanencia en campamento
              </span>
            </div>
            <select
              value={guardRegime}
              onChange={(e) => setGuardRegime(e.target.value)}
              className="h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 px-3"
            >
              <option value="14x7">14 x 7 (Estándar)</option>
              <option value="7x7">7 x 7 (Supervisión)</option>
              <option value="21x7">21 x 7 (Especial)</option>
              <option value="4x3">4 x 3 (Administrativo)</option>
            </select>
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
            onClick={handleSave}
            className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
