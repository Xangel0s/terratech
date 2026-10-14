'use client';

import React, { useState } from 'react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

interface ReportDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  format: 'PDF' | 'XLSX' | 'ZIP';
  norm: string;
}

const AVAILABLE_REPORTS: ReportDefinition[] = [
  {
    id: 'rep-1',
    code: 'INF-SSOMA-04',
    title: 'Matriz General de Acreditación y Pases de Garita',
    description: 'Relación exhaustiva de 8 colaboradores con estado de EMO Anexo 7C, pólizas SCTR y aptitud médica para gran altura.',
    format: 'XLSX',
    norm: 'D.S. 024-2016-EM',
  },
  {
    id: 'rep-2',
    code: 'INF-FLOTA-02',
    title: 'Historial de Inspecciones Pre-Uso de Maquinaria Pesada',
    description: 'Consolidado de checklists con registro de odómetros, firmas digitales táctiles y detalle de paradas críticas.',
    format: 'PDF',
    norm: 'Estándar Anglo American',
  },
  {
    id: 'rep-3',
    code: 'INF-SCTR-09',
    title: 'Pólizas SCTR Rimac & Endosos a favor de Quellaveco',
    description: 'Trazabilidad de vigencias, nómina de asegurados y constancias de pago para fiscalización laboral SUNAFIL.',
    format: 'PDF',
    norm: 'Ley N° 26790',
  },
  {
    id: 'rep-4',
    code: 'INF-HHT-01',
    title: 'Estadística Mensual de Seguridad: Horas Hombre Trabajadas (HHT)',
    description: 'Cálculo de índice de frecuencia y severidad con cero accidentes incapacitantes reportados en la guardia activa.',
    format: 'PDF',
    norm: 'D.S. 023-2017-EM',
  },
];

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [dateFilter, setDateFilter] = useState('guardia_actual');

  if (!isOpen) return null;

  const handleDownload = (format: string, title: string) => {
    onShowToast(`Generando reporte: ${title} (${format}) descargado con éxito`, 'download_done');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-foundry-border">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              analytics
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                CENTRO DE REPORTES &amp; EXPORTACIÓN DE DATOS
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Informes Oficiales de Cumplimiento OSINERGMIN / SUNAFIL / Anglo American
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

        {/* Date Filter Bar */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-foundry-aluminum uppercase">
            Ventana de Tiempo del Reporte:
          </span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-8 rounded-sm bg-white dark:bg-foundry-abyss border border-slate-300 dark:border-foundry-border font-mono text-xs font-semibold text-slate-800 dark:text-foundry-titanium px-3"
          >
            <option value="guardia_actual">Guardia Activa (14x7 en Curso)</option>
            <option value="ultimos_30d">Últimos 30 Días Calendario</option>
            <option value="mes_anterior">Cierre del Mes Anterior</option>
            <option value="acumulado_2026">Acumulado Anual 2026</option>
          </select>
        </div>

        {/* Reports Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AVAILABLE_REPORTS.map((r) => {
            const isSelected = selectedReportId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`p-3.5 rounded-md border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-hardware ${
                  isSelected
                    ? 'border-foundry-blue bg-foundry-surface dark:bg-foundry-surface'
                    : 'border-slate-200 dark:border-foundry-border hover:border-slate-300 dark:hover:border-foundry-border-active bg-white dark:bg-foundry-panel'
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-foundry-abyss text-slate-700 dark:text-foundry-titanium border border-slate-200 dark:border-foundry-border">
                      {r.code}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-foundry-blue dark:text-sky-400">
                      {r.format}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-foundry-titanium leading-tight">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-foundry-aluminum leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-foundry-border text-[10px] font-mono text-slate-400 dark:text-foundry-muted">
                  <span>{r.norm}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(r.format, r.title);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-[#EAEAEA] font-medium flex items-center gap-1 transition-colors text-xs font-mono shadow-none border-0"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    Descargar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
