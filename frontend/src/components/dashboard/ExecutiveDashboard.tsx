'use client';

import React from 'react';
import { WorkerProfile, FleetVehicle, OutboxEvent } from '@/types';

interface ExecutiveDashboardProps {
  workers: WorkerProfile[];
  vehicles: FleetVehicle[];
  outboxEvents: OutboxEvent[];
  onNavigateTab: (tab: 'ssoma' | 'fleet' | 'personnel') => void;
  onSyncNow: () => void;
  onOpenHandover?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = React.memo(({
  workers,
  vehicles,
  outboxEvents,
  onNavigateTab,
  onSyncNow,
  onOpenHandover,
}) => {
  const totalWorkers = workers.length;
  const aptos = workers.filter((w) => w.status === 'apto').length;
  const porVencer = workers.filter((w) => w.status === 'por_vencer').length;
  const bloqueados = workers.filter((w) => w.status === 'bloqueado').length;

  const totalVehicles = vehicles.length;
  const vehOperativos = vehicles.filter((v) => v.status === 'operativo').length;
  const vehBloqueados = vehicles.filter((v) => v.status === 'bloqueado_critico').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Executive Welcome Hero */}
      <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#EDEDED] border border-slate-200 dark:border-[#262626]">
              Operación minera activa
            </span>
            <span className="text-slate-500 dark:text-[#888888] text-xs font-sans">U.M. Quellaveco • Cota 4,200m</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-[#EDEDED] font-sans">
            Panel Ejecutivo Terratech Industrial OS
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#888888] font-sans">
            Control integrado de Acreditaciones SSOMA, Garitas de Acceso y Disponibilidad Mecánica de Flota
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('ssoma')}
            className="h-8 px-3 rounded-md bg-white text-black hover:bg-[#EAEAEA] font-medium text-xs flex items-center gap-1.5 transition-colors shadow-none border-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            SSOMA
          </button>
          <button
            onClick={() => onNavigateTab('fleet')}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">fire_truck</span>
            Flota
          </button>
          <button
            onClick={onOpenHandover}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
            Acta de Guardia
          </button>
        </div>
      </div>

      {/* Analytical KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* SSOMA Compliance Card */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-[#888888] font-medium font-sans">
              Índice de acreditación
            </span>
            <span className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center material-symbols-outlined text-[16px]">
              verified
            </span>
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-[#EDEDED] font-mono">
              {totalWorkers > 0 ? ((aptos / totalWorkers) * 100).toFixed(1) : 0}%
            </div>
            <span className="text-xs text-slate-500 dark:text-[#666666] font-sans">
              {aptos} de {totalWorkers} colaboradores habilitados
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#262626] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${totalWorkers > 0 ? (aptos / totalWorkers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Urgent Warnings Card */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium font-sans">
              Alertas por vencer (≤15d)
            </span>
            <span className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center material-symbols-outlined text-[16px]">
              warning
            </span>
          </div>
          <div>
            <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400 font-mono">{porVencer}</div>
            <span className="text-xs text-slate-500 dark:text-[#666666] font-sans">Pólizas SCTR y EMO en ventana preventiva</span>
          </div>
          <button
            onClick={() => onNavigateTab('ssoma')}
            className="text-xs font-sans text-amber-600 dark:text-amber-400 font-medium hover:underline text-left"
          >
            Gestionar renovaciones →
          </button>
        </div>

        {/* Fleet Availability */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-[#888888] font-medium font-sans">
              Disponibilidad de flota
            </span>
            <span className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#EDEDED] border border-slate-200 dark:border-[#262626] flex items-center justify-center material-symbols-outlined text-[16px]">
              local_shipping
            </span>
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-[#EDEDED] font-mono">
              {totalVehicles > 0 ? ((vehOperativos / totalVehicles) * 100).toFixed(1) : 0}%
            </div>
            <span className="text-xs text-slate-500 dark:text-[#666666] font-sans">
              {vehOperativos} de {totalVehicles} unidades operativas
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#262626] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-white dark:bg-[#EDEDED] h-full rounded-full"
              style={{ width: `${totalVehicles > 0 ? (vehOperativos / totalVehicles) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Critical Locks */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium font-sans">
              Paradas críticas
            </span>
            <span className="w-7 h-7 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center material-symbols-outlined text-[16px]">
              dangerous
            </span>
          </div>
          <div>
            <div className="text-2xl font-semibold text-rose-600 dark:text-rose-400 font-mono">
              {bloqueados + vehBloqueados}
            </div>
            <span className="text-xs text-slate-500 dark:text-[#666666] font-sans">
              {bloqueados} personal + {vehBloqueados} maquinaria bloqueada
            </span>
          </div>
          <div className="text-xs font-sans text-rose-600 dark:text-rose-400 font-medium">
            Protocolo de Garita D.S. 024-2016-EM
          </div>
        </div>
      </div>

      {/* Offline Outbox Queue & Sync Console */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-slate-700 dark:text-[#EDEDED]">
              cloud_sync
            </span>
            <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-[#EDEDED] font-sans">
              Motor de sincronización offline (Outbox queue &amp; reconciliación)
            </h3>
          </div>
          <button
            onClick={onSyncNow}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Forzar Batch POST /api/v1/sync
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {outboxEvents.length === 0 ? (
            <div className="p-3 rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] text-center text-xs font-sans text-slate-500 dark:text-[#888888] flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Todos los eventos locales han sido reconciliados con el servidor central. Cero pendientes.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-[#1F1F1F] border border-slate-200 dark:border-[#262626] rounded-md overflow-hidden text-xs">
              {outboxEvents.map((evt) => (
                <div key={evt.id} className="p-2.5 flex items-center justify-between gap-3 bg-white dark:bg-[#0A0A0A]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20">
                      {evt.eventType}
                    </span>
                    <span className="font-mono text-xs text-slate-700 dark:text-[#EDEDED] truncate">
                      Key: {evt.idempotencyKey.slice(0, 16)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 dark:text-[#666666]">
                    <span>{evt.createdAtUtc.replace('T', ' ').slice(0, 19)}</span>
                    <span className="text-amber-500 font-medium">PENDIENTE</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ExecutiveDashboard.displayName = 'ExecutiveDashboard';
