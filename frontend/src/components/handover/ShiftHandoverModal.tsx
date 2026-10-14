'use client';

import React, { useState } from 'react';
import { WorkerProfile, FleetVehicle } from '@/types';
import { audio } from '@/services/audioService';
import { haptic } from '@/services/hapticService';
import { useSignaturePad } from '@/components/ui/useSignaturePad';

interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: WorkerProfile[];
  vehicles: FleetVehicle[];
  onHandoverSigned: (acta: {
    shift: string;
    outgoingSupervisor: string;
    incomingSupervisor: string;
    notes: string;
    hash: string;
  }) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const ShiftHandoverModal: React.FC<ShiftHandoverModalProps> = ({
  isOpen,
  onClose,
  workers,
  vehicles,
  onHandoverSigned,
  onShowToast,
}) => {
  const [shiftType, setShiftType] = useState<'DIA' | 'NOCHE'>('DIA');
  const [outgoingSupervisor, setOutgoingSupervisor] = useState('Ing. Sarah Jenkins (CIP 184209)');
  const [incomingSupervisor, setIncomingSupervisor] = useState('Ing. Carlos Huamán Rivera (CIP 195431)');
  const [notes, setNotes] = useState('Guardia sin accidentes incapacitantes. 1 parada crítica en taller por fuga hidráulica en VOL-108. Personal de guardia completo al 100%.');

  const sigOut = useSignaturePad();
  const sigIn = useSignaturePad();

  if (!isOpen) return null;

  const aptos = workers.filter((w) => w.status === 'apto').length;
  const bloqueados = workers.filter((w) => w.status === 'bloqueado').length;
  const porVencer = workers.filter((w) => w.status === 'por_vencer').length;

  const vehOperativos = vehicles.filter((v) => v.status === 'operativo').length;
  const vehBloqueados = vehicles.filter((v) => v.status === 'bloqueado_critico').length;

  const clearOut = () => {
    sigOut.clearSignature();
    audio.playClick();
  };

  const clearIn = () => {
    sigIn.clearSignature();
    audio.playClick();
  };

  const handleConfirmHandover = () => {
    const hash = `SHA256-${crypto.randomUUID().slice(0, 16)}...`;
    audio.playChime();
    haptic.vibrateSuccess();

    onHandoverSigned({
      shift: shiftType === 'DIA' ? 'Guardia Día (07:00 - 19:00)' : 'Guardia Noche (19:00 - 07:00)',
      outgoingSupervisor,
      incomingSupervisor,
      notes,
      hash,
    });

    onShowToast(`Acta de Relevo de Guardia sellada con éxito (${hash}). Encolada en Outbox`, 'assignment_turned_in');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-slate-800 dark:text-[#EDEDED]">
              assignment_turned_in
            </span>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#EDEDED]">
                Acta digital de relevo de guardia (Handover 14x7)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888]">
                Entrega y Recepción de Turno Operativo • U.M. Quellaveco (4,200 msnm)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-foundry-muted dark:hover:text-foundry-titanium p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-foundry-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Shift Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-foundry-titanium uppercase">
              Turno Operativo a Entregar:
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => {
                setShiftType('DIA');
                audio.playClick();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                shiftType === 'DIA'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black border border-transparent'
                  : 'bg-transparent text-slate-700 dark:text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
              }`}
              type="button"
            >
              ☀️ Guardia Día (07:00 - 19:00)
            </button>
            <button
              onClick={() => {
                setShiftType('NOCHE');
                audio.playClick();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                shiftType === 'NOCHE'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black border border-transparent'
                  : 'bg-transparent text-slate-700 dark:text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]'
              }`}
              type="button"
            >
              🌙 Guardia Noche (19:00 - 07:00)
            </button>
          </div>
        </div>

        {/* Balance de Guardia Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-foundry-surface border border-emerald-200 dark:border-foundry-border shadow-hardware">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block uppercase">Personal Apto</span>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{aptos} / {workers.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-foundry-muted block">Ingreso Garita 100%</span>
          </div>

          <div className="p-3 rounded-md bg-amber-50/50 dark:bg-foundry-surface border border-amber-200 dark:border-foundry-border shadow-hardware">
            <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold block uppercase">Por Vencer (≤15d)</span>
            <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{porVencer}</span>
            <span className="text-[10px] text-slate-500 dark:text-foundry-muted block">SCTR en renovación</span>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware">
            <span className="text-[10px] text-slate-700 dark:text-foundry-aluminum font-bold block uppercase">Flota Operativa</span>
            <span className="text-xl font-bold text-slate-900 dark:text-foundry-titanium">{vehOperativos} / {vehicles.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-foundry-muted block">Pre-Uso Aprobado</span>
          </div>

          <div className="p-3 rounded-md bg-rose-50/50 dark:bg-foundry-surface border border-rose-200 dark:border-foundry-border shadow-hardware">
            <span className="text-[10px] text-rose-800 dark:text-rose-400 font-bold block uppercase">Paradas Críticas</span>
            <span className="text-xl font-bold text-rose-700 dark:text-rose-400">{bloqueados + vehBloqueados}</span>
            <span className="text-[10px] text-slate-500 dark:text-foundry-muted block">Bloqueo Preventivo</span>
          </div>
        </div>

        {/* Novedades y Observaciones Textarea */}
        <div className="flex flex-col gap-1.5 text-xs">
          <label className="font-bold text-slate-700 dark:text-foundry-titanium font-mono">
            Novedades y Observaciones para la Guardia Entrante:
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-300 dark:border-foundry-border text-slate-900 dark:text-foundry-titanium text-xs focus:ring-foundry-blue focus:border-foundry-blue font-sans shadow-hardware"
          />
        </div>

        {/* Doble Firma Digital Canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Supervisor Saliente */}
          <div className="p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold font-mono text-[11px] text-slate-700 dark:text-foundry-titanium uppercase">
                1. Supervisor Saliente (Entrega):
              </span>
              {sigOut.hasSignature && (
                <button
                  onClick={clearOut}
                  className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-mono"
                  type="button"
                >
                  Borrar
                </button>
              )}
            </div>
            <input
              type="text"
              value={outgoingSupervisor}
              onChange={(e) => setOutgoingSupervisor(e.target.value)}
              className="h-7 px-2 text-[11px] rounded-sm bg-white dark:bg-[#111111] border border-slate-300 dark:border-[#262626] text-slate-900 dark:text-[#EDEDED] font-mono font-semibold"
            />
            <div className="border border-slate-300 dark:border-[#262626] rounded-sm overflow-hidden bg-white relative h-20">
              <canvas
                {...sigOut.canvasProps}
                className="w-full h-full touch-none cursor-crosshair bg-white"
              />
              {!sigOut.hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-[10px] font-mono">
                  Firma táctil del supervisor saliente
                </div>
              )}
            </div>
          </div>

          {/* Supervisor Entrante */}
          <div className="p-3 rounded-md bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] shadow-hardware flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold font-mono text-[11px] text-slate-700 dark:text-[#EDEDED] uppercase">
                2. Supervisor Entrante (Recepción):
              </span>
              {sigIn.hasSignature && (
                <button
                  onClick={clearIn}
                  className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-mono"
                  type="button"
                >
                  Borrar
                </button>
              )}
            </div>
            <input
              type="text"
              value={incomingSupervisor}
              onChange={(e) => setIncomingSupervisor(e.target.value)}
              className="h-7 px-2 text-[11px] rounded-sm bg-white dark:bg-[#111111] border border-slate-300 dark:border-[#262626] text-slate-900 dark:text-[#EDEDED] font-mono font-semibold"
            />
            <div className="border border-slate-300 dark:border-[#262626] rounded-sm overflow-hidden bg-white relative h-20">
              <canvas
                {...sigIn.canvasProps}
                className="w-full h-full touch-none cursor-crosshair bg-white"
              />
              {!sigIn.hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-[10px] font-mono">
                  Firma táctil del supervisor receptor
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={() => onShowToast('Plantilla oficial de Acta de Entrega descargada (.PDF)', 'download')}
            className="text-xs text-slate-600 dark:text-[#888888] hover:text-white font-sans flex items-center gap-1 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Descargar Acta PDF
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmHandover}
              className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] text-xs font-medium flex items-center gap-1.5 transition-colors border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              Cerrar y Sellar Acta de Guardia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
