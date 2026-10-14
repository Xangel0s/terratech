'use client';

import React, { useState } from 'react';
import { WorkerProfile } from '@/types';

interface PersonnelDirectoryProps {
  workers: WorkerProfile[];
  onShowToast: (message: string, icon?: string) => void;
  onOpenWorkerDetail?: (worker: WorkerProfile) => void;
}

export const PersonnelDirectory: React.FC<PersonnelDirectoryProps> = React.memo(({
  workers,
  onShowToast,
  onOpenWorkerDetail,
}) => {
  const [search, setSearch] = useState('');

  const filtered = workers.filter(
    (w) =>
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.dni.includes(search) ||
      w.role.toLowerCase().includes(search.toLowerCase()) ||
      w.cuadrilla.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED] font-sans">Directorio Maestro de Personal</h2>
          <p className="text-xs text-slate-500 dark:text-[#888888] font-sans">
            Fichas individuales, asignación de cuadrillas y régimen atípico de trabajo en faena
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por DNI, nombre o cuadrilla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 px-3 text-xs rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] text-slate-900 dark:text-[#EDEDED] focus:ring-0 focus:border-[#404040] placeholder:text-slate-400 dark:placeholder:text-[#666666] font-sans w-64 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((w) => {
          const isApto = w.status === 'apto';
          const isPorVencer = w.status === 'por_vencer';

          return (
            <div
              key={w.id}
              className="p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between gap-3.5"
            >
              <div className="flex items-start gap-3">
                {w.avatarUrl ? (
                  <img
                    src={w.avatarUrl}
                    alt={w.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-[#262626] flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${w.avatarBg} ${w.avatarColor} border border-slate-200 dark:border-[#262626] flex items-center justify-center font-sans font-medium text-xs flex-shrink-0`}
                  >
                    {w.avatarInitials}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-medium text-sm text-slate-900 dark:text-[#EDEDED] truncate font-sans">{w.fullName}</h3>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#888888] border border-slate-200 dark:border-[#262626] font-normal">
                      DNI {w.dni}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-[#888888] truncate font-sans">{w.role}</span>
                  <span className="text-[11px] text-slate-500 dark:text-[#666666] font-sans truncate">{w.cuadrilla}</span>
                </div>
              </div>

              {/* Specs continuous tabular list without enclosed box */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#1F1F1F] text-xs flex flex-col gap-1.5 font-sans text-[11px]">
                <div className="flex justify-between items-center text-slate-500 dark:text-[#888888]">
                  <span>Guardia:</span>
                  <span className="text-slate-800 dark:text-[#EDEDED] font-medium font-sans">{w.guardia}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-[#888888]">
                  <span>Fotocheck:</span>
                  <span className="text-slate-800 dark:text-[#EDEDED] font-mono font-medium">#{w.fotocheck}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-[#888888]">
                  <span>Pase Mina:</span>
                  <span
                    className={`font-medium font-sans flex items-center gap-1.5 ${
                      isApto
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isPorVencer
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {isApto ? 'Habilitado' : isPorVencer ? 'Por vencer' : 'Restringido'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onOpenWorkerDetail) {
                    onOpenWorkerDetail(w);
                  } else {
                    onShowToast(`Ficha de ${w.fullName} exportada a PDF`, 'badge');
                  }
                }}
                className="h-8 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors font-sans"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                Ver Ficha de Personal
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PersonnelDirectory.displayName = 'PersonnelDirectory';
