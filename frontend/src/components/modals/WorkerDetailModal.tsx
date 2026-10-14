'use client';

import React, { useState } from 'react';
import { WorkerProfile } from '@/types';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface WorkerDetailModalProps {
  isOpen: boolean;
  worker: WorkerProfile | null;
  onClose: () => void;
  onOpenFotocheck: (worker: WorkerProfile) => void;
  onOpenMedicalRecord: (worker: WorkerProfile) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({
  isOpen,
  worker,
  onClose,
  onOpenFotocheck,
  onOpenMedicalRecord,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'credenciales' | 'legal'>('general');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<{
    id: string;
    name: string;
    statusText: string;
    expiryDate: string;
    status: 'conforme' | 'por_vencer' | 'vencido' | 'no_aplica';
  } | null>(null);

  if (!isOpen || !worker) return null;

  const isApto = worker.status === 'apto';
  const isBloqueado = worker.status === 'bloqueado';

  const handleExportPdf = () => {
    onShowToast(`Expediente integral de ${worker.fullName} exportado en formato PDF oficial`, 'picture_as_pdf');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              person_pin
            </span>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-sans">
                FICHA INTEGRAL DEL COLABORADOR
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-sans">
                Expediente de Personal • Contrato Quellaveco • Constructora Andina
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-foundry-titanium p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-foundry-surface transition-colors"
            type="button"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Worker Summary Hero */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-white/[0.08] shadow-hardware flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {worker.avatarUrl ? (
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-14 h-14 rounded-full object-cover ring-1 ring-amber-400 border border-white dark:border-slate-900 shadow-sm flex-shrink-0"
              />
            ) : (
              <div
                className={`w-14 h-14 rounded-full ${worker.avatarBg} ${worker.avatarColor} ring-1 ring-amber-400 flex items-center justify-center font-sans font-bold text-lg flex-shrink-0 shadow-sm`}
              >
                {worker.avatarInitials}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 truncate font-sans">
                {worker.fullName}
              </h4>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                {worker.role} • {worker.specialty}
              </span>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-foundry-panel text-slate-800 dark:text-slate-200 font-mono font-medium border border-transparent dark:border-white/[0.06]">
                  DNI {worker.dni}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-foundry-panel text-slate-800 dark:text-slate-200 font-mono font-medium border border-transparent dark:border-white/[0.06]">
                  FOTOCHECK #{worker.fotocheck}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span
              className={`px-3 py-1 rounded-md text-xs font-sans font-semibold ${
                isApto
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                  : isBloqueado
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/20'
              }`}
            >
              {worker.statusLabel || (isApto ? 'Apto' : isBloqueado ? 'Bloqueado' : 'Por vencer')}
            </span>
            <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400">
              Régimen {worker.guardia}
            </span>
          </div>
        </div>

        {/* Tab Buttons with High Contrast Vercel Styling */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-[#1F1F1F] pb-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-none'
                : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A]'
            }`}
            type="button"
          >
            Datos Operativos
          </button>
          <button
            onClick={() => setActiveTab('credenciales')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all ${
              activeTab === 'credenciales'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-none'
                : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A]'
            }`}
            type="button"
          >
            Matriz Documentaria ({worker.credentials.length})
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all ${
              activeTab === 'legal'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-none'
                : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A]'
            }`}
            type="button"
          >
            Legal &amp; Endoso
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <div className="space-y-2 text-xs font-sans">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cuadrilla Asignada:</span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">{worker.cuadrilla}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Régimen Minero:</span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">{worker.guardia} (Campamento Alta Cota)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Clínica Ocupacional:</span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">{worker.clinic || 'Clínica San José de Moquegua'}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Contacto de Emergencia:</span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED] font-mono">+51 984-210-544 (Familiar Directo)</span>
            </div>
          </div>
        )}

        {activeTab === 'credenciales' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            {worker.credentials.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">{c.name}</span>
                  <span
                    className={`font-semibold text-[10px] px-1.5 py-0.5 rounded-md ${
                      c.status === 'conforme'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : c.status === 'por_vencer'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {c.statusText}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#888888]">
                  Vigencia: <span className="font-mono text-slate-700 dark:text-[#EDEDED]">{c.expiryDate}</span>
                </span>
                {/* Botón para ver y corroborar el archivo adjunto */}
                <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-slate-200 dark:border-[#1F1F1F]">
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#666666] truncate max-w-[140px]">
                    {c.name.toLowerCase().includes('emo')
                      ? `EMO_${worker.dni}_7C.pdf`
                      : c.name.toLowerCase().includes('sctr')
                      ? 'POLIZA_SCTR_RIMAC.pdf'
                      : c.name.toLowerCase().includes('inducción') || c.name.toLowerCase().includes('induccion')
                      ? 'CERT_INDUCCION_MINE.pdf'
                      : 'LICENCIA_4X4_MTC.pdf'}
                  </span>
                  <button
                    onClick={() => setSelectedDocForPreview(c)}
                    className="h-6 px-2 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-[10px] font-medium flex items-center gap-1 transition-colors flex-shrink-0"
                    type="button"
                    title="Ver archivo original y verificar aprobación"
                  >
                    <span className="material-symbols-outlined text-[13px]">visibility</span>
                    <span>Ver Archivo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-2 text-xs font-sans">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex flex-col gap-1">
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">Endoso a favor de Anglo American:</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                Póliza Rimac SCTR Salud N° 99214081 endosada expresamente para operaciones en U.M. Quellaveco.
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex flex-col gap-1">
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED]">Fiscalización OSINERGMIN / SUNAFIL:</span>
              <span className="text-slate-600 dark:text-[#888888]">
                Expediente indexado en libro criptográfico local con hash SHA-256 verificado.
              </span>
            </div>
          </div>
        )}

        {/* Action buttons inside ficha */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenFotocheck(worker);
              }}
              className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">badge</span>
              Ver Fotocheck PVC
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenMedicalRecord(worker);
              }}
              className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">health_and_safety</span>
              Ver Anexo 7C
            </button>
            <button
              onClick={handleExportPdf}
              className="h-8 px-3 rounded-md bg-white text-black hover:bg-[#EAEAEA] font-medium text-xs flex items-center gap-1.5 transition-colors border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
              Exportar Ficha PDF
            </button>
          </div>
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de Corroboración y Vista de Archivo Subido */}
      <DocumentPreviewModal
        isOpen={Boolean(selectedDocForPreview)}
        onClose={() => setSelectedDocForPreview(null)}
        documentData={selectedDocForPreview}
        workerName={worker.fullName}
        workerDni={worker.dni}
        workerFotocheck={worker.fotocheck}
        onShowToast={onShowToast}
      />
    </div>
  );
};
