'use client';

import React, { useState } from 'react';
import { audio } from '@/services/audioService';

interface TelemetryEvent {
  id: string;
  timeUtc: string;
  level: 'CRITICAL' | 'AUDIT' | 'SYNC' | 'OPS';
  device: string;
  action: string;
  payload: string;
  sha256: string;
}

const INITIAL_TELEMETRY: TelemetryEvent[] = [
  { id: 'tel-1', timeUtc: '23:28:10', level: 'CRITICAL', device: 'TALLER-MEC-02', action: 'PRE_USO_LOCKOUT', payload: 'Volquete VOL-108 freno/hidráulico NC', sha256: '71cf4081da22e987...' },
  { id: 'tel-2', timeUtc: '23:25:44', level: 'OPS', device: 'GARITA-ALFA-4200m', action: 'GATE_PASS_VERIFIED', payload: 'María Elena Tapia (DNI 44892105) pase concedido', sha256: 'e4a8b912c0fa43e8...' },
  { id: 'tel-3', timeUtc: '23:21:02', level: 'SYNC', device: 'CLIENT-PWA-OFFLINE', action: 'OUTBOX_RECONCILE', payload: 'Batch 4 eventos transmitidos a Anglo American', sha256: '9b12fe3480ac22d1...' },
  { id: 'tel-4', timeUtc: '23:15:30', level: 'AUDIT', device: 'CONSOLA-SSOMA-01', action: 'POLICY_EVALUATION', payload: 'D.S. 024-2016-EM tolerancia cero activa', sha256: '33cb09ef8841a540...' },
  { id: 'tel-5', timeUtc: '23:08:12', level: 'OPS', device: 'GARITA-BRAVO-TAJO', action: 'RFID_READ', payload: 'Héctor Quispe (Fotocheck #71829) autorizado', sha256: 'a19ed450ff812901...' },
];

interface BlackboxTickerProps {
  isCollapsed?: boolean;
}

export const BlackboxTicker: React.FC<BlackboxTickerProps> = ({ isCollapsed = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'CRITICAL' | 'AUDIT' | 'SYNC' | 'OPS'>('ALL');
  const [copied, setCopied] = useState(false);

  const toggleExpand = () => {
    audio.playClick();
    setIsExpanded(!isExpanded);
  };

  const handleCopy = () => {
    audio.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = INITIAL_TELEMETRY.filter(
    (t) => filterLevel === 'ALL' || t.level === filterLevel
  );

  const latest = INITIAL_TELEMETRY[0];

  return (
    <aside
      aria-label="Caja Negra y Telemetría en Vivo"
      className={`fixed bottom-0 right-0 z-40 bg-white dark:bg-black border-t border-slate-200 dark:border-[#262626] text-slate-700 dark:text-[#888888] font-mono text-xs transition-[left] duration-150 ease-out will-change-[left] left-0 ${
        isCollapsed ? 'lg:left-[4.5rem]' : 'lg:left-64'
      }`}
    >
      {/* Ticker Bar (Always Visible) */}
      <div className="h-10 px-3 sm:px-6 flex items-center justify-between gap-3 bg-white dark:bg-black">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <span className="text-[10px] font-medium text-slate-700 dark:text-[#EDEDED] tracking-wider hidden sm:inline uppercase">
              CAJA NEGRA TELEMETRÍA
            </span>
          </div>

          <span className="text-slate-300 dark:text-[#333333] hidden sm:inline">|</span>

          {/* Real-time ticker stream message */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden text-[11px] truncate">
            <span className="text-slate-500 dark:text-[#666666] flex-shrink-0">[{latest.timeUtc} PET]</span>
            <span
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-medium flex-shrink-0 ${
                latest.level === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                  : latest.level === 'SYNC'
                  ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-[#EDEDED] border border-slate-200 dark:border-[#333333]'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {latest.action}
            </span>
            <span className="text-slate-800 dark:text-[#EDEDED] truncate">{latest.payload}</span>
            <span className="text-slate-500 dark:text-[#666666] hidden md:inline text-[10px]">
              HASH: {latest.sha256}
            </span>
          </div>
        </div>

        {/* Right Toggle Action */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-slate-500 dark:text-[#666666] hidden lg:inline">
            QUELLAVECO 4,200m • SSL PINNED
          </span>
          <button
            onClick={toggleExpand}
            className="h-7 px-2.5 rounded-md bg-slate-100 dark:bg-transparent hover:bg-slate-200 dark:hover:bg-[#1A1A1A] text-slate-800 dark:text-[#888888] hover:dark:text-white text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-200 dark:border-[#262626]"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isExpanded ? 'expand_more' : 'expand_less'}
            </span>
            <span>{isExpanded ? 'MINIMIZAR' : 'VER BITÁCORA'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Console Drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#0A0A0A] flex flex-col gap-3 max-h-72 overflow-hidden animate-fadeIn">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-800 dark:text-[#EDEDED]">
                REGISTRO INMUTABLE DE EVENTOS CRIPTOGRÁFICOS
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#666666]">
                (LAT: -17.0624, LON: -70.6128)
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1">
              {(['ALL', 'CRITICAL', 'AUDIT', 'SYNC', 'OPS'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    audio.playClick();
                    setFilterLevel(lvl);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                    filterLevel === lvl
                      ? 'bg-white text-black'
                      : 'text-slate-600 dark:text-[#888888] hover:text-white hover:bg-slate-200 dark:hover:bg-[#1A1A1A]'
                  }`}
                  type="button"
                >
                  {lvl}
                </button>
              ))}
              <button
                onClick={handleCopy}
                className="ml-2 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-transparent hover:bg-slate-300 dark:hover:bg-[#1A1A1A] text-slate-700 dark:text-[#888888] hover:dark:text-white text-[10px] font-medium flex items-center gap-1 border border-slate-300 dark:border-[#262626] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                {copied ? 'COPIADO' : 'COPIAR LOG'}
              </button>
            </div>
          </div>

          {/* Telemetry Stream Lines */}
          <div className="overflow-y-auto max-h-48 space-y-1.5 pr-1">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-2 rounded-md bg-white dark:bg-black border border-slate-200 dark:border-[#262626] hover:border-slate-300 dark:hover:border-[#404040] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-500 dark:text-[#666666] flex-shrink-0">[{t.timeUtc}]</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-sm text-[9px] font-medium flex-shrink-0 ${
                      t.level === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                        : t.level === 'SYNC'
                        ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-[#EDEDED] border border-slate-200 dark:border-[#333333]'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {t.level}
                  </span>
                  <span className="text-slate-700 dark:text-[#EDEDED] font-medium flex-shrink-0">{t.device}</span>
                  <span className="text-slate-600 dark:text-[#888888] truncate">{t.payload}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-[#666666] flex-shrink-0">
                  <span className="truncate">SHA: {t.sha256}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
