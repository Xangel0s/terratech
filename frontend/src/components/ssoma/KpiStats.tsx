'use client';

import React from 'react';

interface KpiStatsProps {
  total: number;
  aptos: number;
  porVencer: number;
  bloqueados: number;
}

export const KpiStats: React.FC<KpiStatsProps> = React.memo(({
  total,
  aptos,
  porVencer,
  bloqueados,
}) => {
  const aptoPercent = total > 0 ? ((aptos / total) * 100).toFixed(1) : '0';

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
      {/* Total Evaluated */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-[#888888] font-medium font-sans truncate">
            Personal evaluado
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#262626] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-slate-600 dark:text-[#888888] text-[16px] sm:text-[18px]">
              groups
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-mono text-xl sm:text-2xl font-semibold text-slate-900 dark:text-[#EDEDED] tracking-tight">
            {total}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#666666] font-sans truncate">
            en guardia
          </span>
        </div>
      </div>

      {/* Aptos */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-[#888888] font-medium font-sans truncate">
              Aptos ingreso
            </span>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-emerald-500 text-[16px] sm:text-[18px]">
              check_circle
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-mono text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {aptos}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#666666] font-sans truncate">
            {aptoPercent}% conforme
          </span>
        </div>
      </div>

      {/* Por Vencer */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-[#888888] font-medium font-sans truncate">
              Por vencer (≤15d)
            </span>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-amber-500 text-[16px] sm:text-[18px]">
              warning
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-mono text-xl sm:text-2xl font-semibold text-amber-600 dark:text-amber-400 tracking-tight">
            {porVencer}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#666666] font-sans truncate">
            prioritario
          </span>
        </div>
      </div>

      {/* Restringidos / Bloqueados */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-[#888888] font-medium font-sans truncate">
              Restringidos
            </span>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-rose-500 text-[16px] sm:text-[18px]">
              block
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-mono text-xl sm:text-2xl font-semibold text-rose-600 dark:text-rose-400 tracking-tight">
            {bloqueados}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#666666] font-sans truncate">
            inhabilitados
          </span>
        </div>
      </div>
    </section>
  );
});

KpiStats.displayName = 'KpiStats';
