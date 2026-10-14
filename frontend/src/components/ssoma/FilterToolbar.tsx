'use client';

import React from 'react';
import { ComplianceStatus } from '@/types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: 'all' | ComplianceStatus;
  onStatusChange: (status: 'all' | ComplianceStatus) => void;
  selectedCuadrilla: string;
  onCuadrillaChange: (cuadrilla: string) => void;
  counts: {
    total: number;
    aptos: number;
    porVencer: number;
    bloqueados: number;
  };
}

export const FilterToolbar: React.FC<FilterToolbarProps> = React.memo(({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCuadrilla,
  onCuadrillaChange,
  counts,
}) => {
  return (
    <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 p-2.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
      {/* Search Input */}
      <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] focus-within:border-slate-400 dark:focus-within:border-[#404040] transition-colors">
        <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-[#666666]">
          search
        </span>
        <input
          className="w-full bg-transparent border-0 p-0 text-slate-900 dark:text-[#EDEDED] font-sans text-xs sm:text-sm focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-[#666666]"
          placeholder="Buscar por colaborador, DNI o cargo..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-600 dark:text-[#666666] dark:hover:text-[#EDEDED] p-0.5"
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Status Segment Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#262626] no-scrollbar">
        <button
          className={`px-3 py-1 rounded-md text-xs font-sans transition-colors whitespace-nowrap flex-shrink-0 ${
            selectedStatus === 'all'
              ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-transparent'
              : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white font-normal'
          }`}
          onClick={() => onStatusChange('all')}
          type="button"
        >
          Todos <span className="text-[10px] font-mono opacity-80 ml-1">{counts.total}</span>
        </button>

        <button
          className={`px-3 py-1 rounded-md text-xs font-sans transition-colors whitespace-nowrap flex-shrink-0 ${
            selectedStatus === 'apto'
              ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-transparent'
              : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white font-normal'
          }`}
          onClick={() => onStatusChange('apto')}
          type="button"
        >
          Aptos <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 ml-1 font-bold">{counts.aptos}</span>
        </button>

        <button
          className={`px-3 py-1 rounded-md text-xs font-sans transition-colors whitespace-nowrap flex-shrink-0 ${
            selectedStatus === 'por_vencer'
              ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-transparent'
              : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white font-normal'
          }`}
          onClick={() => onStatusChange('por_vencer')}
          type="button"
        >
          Por Vencer <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 ml-1 font-bold">{counts.porVencer}</span>
        </button>

        <button
          className={`px-3 py-1 rounded-md text-xs font-sans transition-colors whitespace-nowrap flex-shrink-0 ${
            selectedStatus === 'bloqueado'
              ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-transparent'
              : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white font-normal'
          }`}
          onClick={() => onStatusChange('bloqueado')}
          type="button"
        >
          Bloqueados <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 ml-1 font-bold">{counts.bloqueados}</span>
        </button>
      </div>

      {/* Discrete Cuadrilla Selector */}
      <div className="flex items-center lg:pr-1">
        <select
          className="w-full lg:w-auto h-8 rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] hover:border-[#404040] text-xs text-slate-700 dark:text-[#EDEDED] focus:ring-0 focus:border-[#404040] py-1 pl-2.5 pr-7 font-sans transition-colors"
          value={selectedCuadrilla}
          onChange={(e) => onCuadrillaChange(e.target.value)}
        >
          <option value="ALL">Todas las cuadrillas</option>
          <option value="Perforación y Voladura">Perforación &amp; Voladura</option>
          <option value="Mantenimiento de Planta">Mantenimiento de Planta</option>
          <option value="Movimiento de Tierras">Movimiento de Tierras</option>
          <option value="Transporte y Acarreo">Transporte &amp; Acarreo</option>
        </select>
      </div>
    </section>
  );
});

FilterToolbar.displayName = 'FilterToolbar';
