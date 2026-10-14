'use client';

import React, { useState, useRef } from 'react';
import { FleetVehicle, ChecklistItem, PreUsoInspection } from '@/types';
import { db } from '@/db';
import { audio } from '@/services/audioService';
import { haptic } from '@/services/hapticService';

import { useSignaturePad } from '@/components/ui/useSignaturePad';

interface FleetModuleProps {
  vehicles: FleetVehicle[];
  onInspectionSubmitted: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'item-1', category: 'Sistemas Críticos', name: 'Frenos de servicio y estacionamiento', isCritical: true, status: 'C' },
  { id: 'item-2', category: 'Sistemas Críticos', name: 'Dirección y terminales', isCritical: true, status: 'C' },
  { id: 'item-3', category: 'Sistemas Críticos', name: 'Fugas mayores de aceite, hidráulico o combustible', isCritical: true, status: 'C' },
  { id: 'item-4', category: 'Elementos de Seguridad', name: 'Cinturones de seguridad de 3 puntos', isCritical: true, status: 'C' },
  { id: 'item-5', category: 'Elementos de Seguridad', name: 'Extintor PQS 6kg vigente y presurizado', isCritical: false, status: 'C' },
  { id: 'item-6', category: 'Luces & Señalización', name: 'Circulina estroboscópica y pértiga con banderola', isCritical: false, status: 'C' },
  { id: 'item-7', category: 'Luces & Señalización', name: 'Luces altas, bajas, direccionales y alarma de retroceso', isCritical: false, status: 'C' },
  { id: 'item-8', category: 'Neumáticos / Rodado', name: 'Presión y cocada de neumáticos / zapatas de oruga', isCritical: false, status: 'C' },
];

export const FleetModule: React.FC<FleetModuleProps> = React.memo(({
  vehicles,
  onInspectionSubmitted,
  onShowToast,
}) => {
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS);
  const [operatorName, setOperatorName] = useState('Ing. María Elena Tapia');
  const [operatorDni, setOperatorDni] = useState('44892105');
  const [hasPhoto, setHasPhoto] = useState(false);

  const {
    canvasRef,
    hasSignature: signatureDone,
    clearSignature,
    canvasProps,
  } = useSignaturePad();

  const handleOpenChecklist = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setChecklistItems(DEFAULT_CHECKLIST_ITEMS.map((item) => ({ ...item, status: 'C' })));
    clearSignature();
    setHasPhoto(false);
    setIsChecklistModalOpen(true);
  };

  const handleItemStatusChange = (id: string, status: 'C' | 'NC' | 'NA') => {
    const targetItem = checklistItems.find((i) => i.id === id);
    if (targetItem?.isCritical && status === 'NC') {
      audio.playWarningAlarm();
      haptic.vibrateEmergency();
    } else {
      audio.playClick();
      haptic.vibrateClick();
    }

    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const criticalFailures = checklistItems.filter(
    (item) => item.isCritical && item.status === 'NC'
  );
  const hasCriticalFailure = criticalFailures.length > 0;

  const handleSubmitChecklist = async () => {
    if (!selectedVehicle) return;

    const idempotencyKey = crypto.randomUUID();
    const nowUtc = new Date().toISOString();

    const newInspection: PreUsoInspection = {
      id: `insp-${Date.now()}`,
      idempotencyKey,
      vehicleId: selectedVehicle.id,
      operatorDni,
      operatorName,
      dateUtc: nowUtc,
      items: checklistItems,
      hasCriticalFailure,
      criticalItemsFailed: criticalFailures.map((i) => i.name),
      signatureDataUrl: signatureDone ? 'signature-captured' : undefined,
      synced: false,
    };

    // Save to Dexie
    await db.inspections.add(newInspection);

    // Update vehicle status
    const newVehicleStatus = hasCriticalFailure
      ? 'bloqueado_critico'
      : checklistItems.some((i) => i.status === 'NC')
      ? 'observado'
      : 'operativo';

    await db.vehicles.update(selectedVehicle.id, {
      status: newVehicleStatus,
      lastInspectionDate: nowUtc.replace('T', ' ').slice(0, 16),
    });

    // Queue Outbox Event for background sync
    await db.outbox_events.add({
      id: `evt-${Date.now()}`,
      idempotencyKey,
      eventType: 'CHECKLIST_SUBMIT',
      payload: newInspection,
      createdAtUtc: nowUtc,
      synced: false,
      retryCount: 0,
    });

    setIsChecklistModalOpen(false);
    onInspectionSubmitted();

    if (hasCriticalFailure) {
      audio.playWarningAlarm();
      haptic.vibrateEmergency();
      onShowToast(
        `¡ALERTA PELIGRO CRÍTICO! ${selectedVehicle.code} bloqueado automáticamente. Jefe de taller notificado.`,
        'dangerous'
      );
    } else {
      audio.playChime();
      haptic.vibrateSuccess();
      onShowToast(
        `Checklist pre-uso para ${selectedVehicle.code} registrado y firmado con éxito.`,
        'verified'
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Operativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-[#EDEDED] tracking-tight font-sans">
            Módulo de Flota &amp; Checklists Pre-Uso
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#888888] font-sans">
            Inspección táctica pre-operacional en campo — Reemplazo del talonario físico en papel carbón
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#888888] border border-slate-200 dark:border-[#262626] font-normal">
            D.S. 024-2016-EM • ART. 375
          </span>
        </div>
      </div>

      {/* Grid de Vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((v) => {
          const isOperativo = v.status === 'operativo';
          const isObservado = v.status === 'observado';
          const isBloqueado = v.status === 'bloqueado_critico';

          return (
            <div
              key={v.id}
              className="p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-[#EDEDED] border border-slate-200 dark:border-[#262626]">
                    {v.code}
                  </span>
                  {isOperativo && (
                    <span className="font-sans text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                      Operativo
                    </span>
                  )}
                  {isObservado && (
                    <span className="font-sans text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
                      Observado
                    </span>
                  )}
                  {isBloqueado && (
                    <span className="font-sans text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium border border-rose-500/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">lock</span>
                      Parada Crítica
                    </span>
                  )}
                </div>

                <h3 className="font-medium text-sm text-slate-900 dark:text-[#EDEDED] font-sans">{v.brandModel}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#888888] font-sans">
                  <span>Placa: <strong className="font-mono font-medium">{v.plate}</strong></span>
                  <span className="font-mono font-medium text-slate-700 dark:text-[#EDEDED]">{v.odometerOrHours}</span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-[#888888] flex items-center gap-1 font-sans">
                  <span className="material-symbols-outlined text-[14px] text-slate-400 dark:text-[#666666]">person</span>
                  <span className="truncate">{v.assignedOperator}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1F1F1F] flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-slate-400 dark:text-[#666666] truncate">
                  Insp: {v.lastInspectionDate}
                </span>
                <button
                  onClick={() => handleOpenChecklist(v)}
                  className={`h-8 px-3 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 transition-colors ${
                    isBloqueado
                      ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                      : 'bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">fact_check</span>
                  Checklist
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Formulario de Inspección Pre-Uso y Firma Digital */}
      {isChecklistModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] my-auto max-h-[90vh] overflow-y-auto font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[24px] text-slate-800 dark:text-[#EDEDED]">
                  fact_check
                </span>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#EDEDED]">
                    Inspección pre-uso: <span className="font-mono">{selectedVehicle.code}</span> (<span className="font-mono">{selectedVehicle.plate}</span>)
                  </h3>
                  <span className="font-sans text-xs text-slate-500 dark:text-[#888888]">
                    {selectedVehicle.brandModel} • Tipo: {selectedVehicle.type}
                  </span>
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-slate-700 dark:text-[#666666] dark:hover:text-[#EDEDED] p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsChecklistModalOpen(false)}
                type="button"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Alerta de Peligro Crítico en tiempo real */}
            {hasCriticalFailure && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-2.5 text-xs animate-pulse">
                <span className="material-symbols-outlined text-rose-500 text-[20px] flex-shrink-0">
                  dangerous
                </span>
                <div className="font-sans">
                  <strong className="block font-semibold">BLOQUEO PREVENTIVO AUTOMÁTICO</strong>
                  Ha marcado No Conforme en un ítem crítico ({criticalFailures.map((c) => c.name).join(', ')}). Al confirmar, la maquinaria quedará bloqueada en el sistema.
                </div>
              </div>
            )}

            {/* Checklist Items */}
            <div className="flex flex-col gap-2">
              <span className="font-sans text-xs font-medium text-slate-500 dark:text-[#888888]">
                Puntos de inspección visual y operativa:
              </span>

              <div className="flex flex-col divide-y divide-slate-100 dark:divide-[#1F1F1F] border border-slate-200 dark:border-[#262626] rounded-lg overflow-hidden text-xs">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 flex items-center justify-between gap-3 ${
                      item.isCritical && item.status === 'NC'
                        ? 'bg-rose-500/10'
                        : 'bg-white dark:bg-[#0A0A0A] hover:bg-slate-50 dark:hover:bg-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.isCritical && (
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold flex-shrink-0"
                          title="Falla provoca parada automática inmediata"
                        >
                          CRÍTICO
                        </span>
                      )}
                      <span className="text-slate-800 dark:text-[#EDEDED] font-sans font-medium">{item.name}</span>
                    </div>

                    {/* Botones C / NC / NA con tamaño ergonómico */}
                    <div className="flex items-center gap-1 flex-shrink-0 font-mono">
                      <button
                        type="button"
                        onClick={() => handleItemStatusChange(item.id, 'C')}
                        className={`w-9 h-8 rounded-md font-mono font-medium text-xs transition-colors ${
                          item.status === 'C'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-[#888888] hover:bg-slate-200 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
                        }`}
                        title="Conforme"
                      >
                        C
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemStatusChange(item.id, 'NC')}
                        className={`w-9 h-8 rounded-md font-mono font-medium text-xs transition-colors ${
                          item.status === 'NC'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-[#888888] hover:bg-slate-200 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
                        }`}
                        title="No Conforme"
                      >
                        NC
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemStatusChange(item.id, 'NA')}
                        className={`w-9 h-8 rounded-md font-mono font-medium text-xs transition-colors ${
                          item.status === 'NA'
                            ? 'bg-slate-700 dark:bg-[#262626] text-white'
                            : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-[#888888] hover:bg-slate-200 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
                        }`}
                        title="No Aplica"
                      >
                        NA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidencia Fotográfica */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="font-sans text-xs font-medium text-slate-500 dark:text-[#888888]">
                Evidencia fotográfica de campo:
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasPhoto(true);
                  onShowToast('Foto de inspección capturada con georreferenciación UTC', 'camera');
                }}
                className={`p-3 rounded-lg border border-dashed flex items-center justify-center gap-2 transition-colors ${
                  hasPhoto
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-300 dark:border-[#262626] hover:border-[#404040] bg-slate-50 dark:bg-black text-slate-600 dark:text-[#888888]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {hasPhoto ? 'check_circle' : 'photo_camera'}
                </span>
                <span className="font-medium font-sans">
                  {hasPhoto
                    ? 'Foto de odómetro y frente de máquina capturada'
                    : 'Tomar foto con cámara del dispositivo móvil'}
                </span>
              </button>
            </div>

            {/* Firma Digital en Pantalla Táctil */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-slate-500 dark:text-[#888888]">
                  Firma digital del operador (táctil):
                </span>
                {signatureDone && (
                  <button
                    onClick={clearSignature}
                    className="text-[11px] text-rose-500 hover:underline font-sans"
                    type="button"
                  >
                    Borrar firma
                  </button>
                )}
              </div>
              <div className="border border-slate-300 dark:border-[#262626] rounded-lg overflow-hidden bg-slate-50/50 dark:bg-black relative">
                <canvas
                  {...canvasProps}
                  className="w-full h-[110px] touch-none cursor-crosshair bg-white"
                />
                {!signatureDone && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-sans">
                    Dibuje su firma con el dedo o puntero táctil
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 dark:text-[#666666]">
                <span>Operador: <strong className="text-slate-700 dark:text-[#EDEDED]">{operatorName}</strong> (DNI <span className="font-mono">{operatorDni}</span>)</span>
                <span className="font-mono text-[10px]">UUIDv4 activo</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1F1F1F]">
              <button
                className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
                onClick={() => setIsChecklistModalOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={`h-8 px-3.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors ${
                  hasCriticalFailure
                    ? 'bg-[#E5484D] hover:bg-[#D9383E] text-white'
                    : 'bg-white text-black hover:bg-[#EAEAEA] border-0'
                }`}
                onClick={handleSubmitChecklist}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {hasCriticalFailure ? 'dangerous' : 'check'}
                </span>
                {hasCriticalFailure ? 'REGISTRAR BLOQUEO CRÍTICO' : 'CONFIRMAR Y FIRMAR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FleetModule.displayName = 'FleetModule';
