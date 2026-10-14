'use client';

import React, { useState } from 'react';

interface PlantConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const PlantConfigModal: React.FC<PlantConfigModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [altitude, setAltitude] = useState(4200);
  const [geofencingActive, setGeofencingActive] = useState(true);
  const [telemetryEndpoint, setTelemetryEndpoint] = useState('https://scada-gateway.quellaveco.pe:8443/v1/sync');

  if (!isOpen) return null;

  const handleSave = () => {
    onShowToast('Parámetros de Planta Quellaveco actualizados y comunicados a telemetría local', 'precision_manufacturing');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              precision_manufacturing
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                PARÁMETROS DE PLANTA &amp; UNIDAD MINERA
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                U.M. Quellaveco • Anglo American • Cota 4,200 MSNM
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

        {/* Plant Details */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col gap-2">
            <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium">
              Zonas Operativas Homologadas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded-sm bg-white dark:bg-foundry-abyss border border-slate-200 dark:border-foundry-border flex flex-col">
                <span className="font-bold text-slate-800 dark:text-foundry-titanium">TAJO ABIERTO</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Cota 4,200m • Geocerca A-1</span>
              </div>
              <div className="p-2 rounded-sm bg-white dark:bg-foundry-abyss border border-slate-200 dark:border-foundry-border flex flex-col">
                <span className="font-bold text-slate-800 dark:text-foundry-titanium">PLANTA PAPUJUNE</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Concentradora • Polígono B-2</span>
              </div>
              <div className="p-2 rounded-sm bg-white dark:bg-foundry-abyss border border-slate-200 dark:border-foundry-border flex flex-col">
                <span className="font-bold text-slate-800 dark:text-foundry-titanium">GARITA KM 34</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Pase Principal • Control Torniquetes</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium block">
                Cota de Operación Oficial (Gran Altura)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum">
                Ajusta el protocolo de oximetría y prueba de esfuerzo en Anexo 7C
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="number"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-20 h-8 text-center rounded-sm bg-white dark:bg-foundry-abyss border border-slate-300 dark:border-foundry-border font-bold text-slate-800 dark:text-foundry-titanium"
              />
              <span className="text-slate-500 dark:text-foundry-muted">msnm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium block">
                Alerta Perimetral por Geocerca Automática
              </span>
              <span className="text-[11px] text-slate-500 dark:text-foundry-aluminum">
                Emite advertencia si un operador inhabilitado es detectado por GPS dentro del tajo
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={geofencingActive}
                onChange={(e) => setGeofencingActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-[#262626] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col gap-1.5">
            <span className="font-bold text-xs text-slate-900 dark:text-foundry-titanium">
              Gateway Central de Telemetría SCADA
            </span>
            <input
              type="text"
              value={telemetryEndpoint}
              onChange={(e) => setTelemetryEndpoint(e.target.value)}
              className="h-8 px-3 rounded-sm bg-white dark:bg-foundry-abyss border border-slate-300 dark:border-foundry-border font-mono text-xs text-slate-800 dark:text-foundry-titanium"
            />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span> SSL PINNING HASH: 91af8812ceb0a4... (Verificado)
            </span>
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
            <span className="material-symbols-outlined text-[16px]">check</span>
            Guardar Parámetros de Planta
          </button>
        </div>
      </div>
    </div>
  );
};
