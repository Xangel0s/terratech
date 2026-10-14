'use client';

import React, { useState } from 'react';
import { audio } from '@/services/audioService';
import { haptic } from '@/services/hapticService';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessBatch: (count: number) => void;
  onShowToast: (message: string, icon?: string) => void;
}

interface BatchRecord {
  dni: string;
  fullName: string;
  cargo: string;
  docType: string;
  vigencia: string;
  status: 'valid' | 'warning' | 'error';
  observacion: string;
}

const PREVIEW_DATA: BatchRecord[] = [
  { dni: '44892105', fullName: 'Ing. María Elena Tapia', cargo: 'Sup. SSOMA', docType: 'EMO Anexo 7C', vigencia: '14/11/2026', status: 'valid', observacion: 'Sello MINSA validado' },
  { dni: '09812455', fullName: 'Javier Paredes Silva', cargo: 'Técnico Mecánico', docType: 'Póliza SCTR Rimac', vigencia: '31/03/2026', status: 'warning', observacion: 'Vence en ≤15 días' },
  { dni: '10293844', fullName: 'Roberto Arteaga Ramos', cargo: 'Operador Perforadora', docType: 'EMO Anexo 7C', vigencia: '02/02/2026', status: 'error', observacion: 'Examen caducado' },
  { dni: '71829304', fullName: 'Héctor Quispe Mamani', cargo: 'Conductor Cisterna', docType: 'Manejo Defensivo 4x4', vigencia: '18/08/2026', status: 'valid', observacion: 'Homologación OK' },
  { dni: '45902188', fullName: 'Carlos Fuentes Benítez', cargo: 'Electricista Mina', docType: 'Espacios Confinados', vigencia: '10/12/2026', status: 'valid', observacion: 'Certificado TEK-2025' },
];

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onProcessBatch,
  onShowToast,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>('ROSTER_ACREDITACION_LOTE_MARZO.csv');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    audio.playClick();
    setSelectedFile('LOTE_EXPEDIENTES_MINE_INGRESS_2026.zip');
    onShowToast('Archivo comprimido analizado: 5 expedientes detectados', 'folder_zip');
  };

  const handleProcess = () => {
    setIsProcessing(true);
    audio.playBeep(700, 0.08);
    haptic.vibrateClick();
    setTimeout(() => {
      setIsProcessing(false);
      audio.playChime();
      haptic.vibrateSuccess();
      onProcessBatch(PREVIEW_DATA.length);
      onShowToast(`Lote procesado: ${PREVIEW_DATA.length} acreditaciones sincronizadas con Garita Quellaveco`, 'cloud_done');
      onClose();
    }, 900);
  };

  const filteredRecords = PREVIEW_DATA.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-slate-800 dark:text-[#EDEDED]">
              upload_file
            </span>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-[#EDEDED]">
                Carga masiva de acreditaciones SSOMA
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888]">
                Ingestión de lotes CSV / ZIP • Validación de Anexo 7C y Pólizas SCTR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-[#666666] dark:hover:text-[#EDEDED] p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        <div
          onClick={handleSimulateUpload}
          className="border border-dashed border-slate-300 dark:border-[#262626] hover:border-[#404040] rounded-lg p-4 bg-slate-50/60 dark:bg-black cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-[#111111] text-slate-700 dark:text-[#EDEDED] flex items-center justify-center flex-shrink-0 border border-slate-300 dark:border-[#262626]">
              <span className="material-symbols-outlined text-[22px]">drive_folder_upload</span>
            </div>
            <div>
              <span className="font-medium text-xs sm:text-sm text-slate-800 dark:text-[#EDEDED] block">
                {selectedFile ? selectedFile : 'Arrastre su archivo CSV o paquete ZIP aquí'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#888888]">
                Estructura compatible SUNAFIL • Máximo 100 MB por lote
              </span>
            </div>
          </div>
          <button
            type="button"
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors flex-shrink-0"
          >
            Examinar archivo
          </button>
        </div>

        {/* Pre-validation Preview Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-800 dark:text-[#EDEDED]">
              Registros detectados ({PREVIEW_DATA.length})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                audio.playClick();
                setFilterStatus('all');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 dark:bg-[#1A1A1A] text-white'
                  : 'text-slate-500 dark:text-[#888888] hover:text-white'
              }`}
              type="button"
            >
              Todos
            </button>
            <button
              onClick={() => {
                audio.playBeep(880, 0.05);
                setFilterStatus('valid');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterStatus === 'valid'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-300'
              }`}
              type="button"
            >
              Conformes (3)
            </button>
            <button
              onClick={() => {
                audio.playBeep(440, 0.08);
                setFilterStatus('warning');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterStatus === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-600 dark:text-amber-400 hover:text-amber-300'
              }`}
              type="button"
            >
              Observados (1)
            </button>
            <button
              onClick={() => {
                audio.playWarningAlarm();
                haptic.vibrateWarning();
                setFilterStatus('error');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterStatus === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-600 dark:text-rose-400 hover:text-rose-300'
              }`}
              type="button"
            >
              Bloqueados (1)
            </button>
          </div>
        </div>

        {/* Table of Parsed Records */}
        <div className="border border-slate-200 dark:border-[#262626] rounded-md overflow-hidden bg-slate-50/50 dark:bg-black">
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 dark:bg-[#0A0A0A] text-[11px] text-slate-500 dark:text-[#888888] uppercase tracking-wider sticky top-0 border-b border-slate-200 dark:border-[#262626]">
                <tr>
                  <th className="p-2.5">DNI</th>
                  <th className="p-2.5">Colaborador</th>
                  <th className="p-2.5">Documento</th>
                  <th className="p-2.5">Vigencia</th>
                  <th className="p-2.5">Estado</th>
                  <th className="p-2.5">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-[#1F1F1F] text-xs">
                {filteredRecords.map((r) => (
                  <tr key={r.dni} className="hover:bg-white dark:hover:bg-[#111111]">
                    <td className="p-2.5 font-mono text-slate-700 dark:text-[#888888]">{r.dni}</td>
                    <td className="p-2.5 text-slate-900 dark:text-[#EDEDED] font-medium">{r.fullName}</td>
                    <td className="p-2.5 text-slate-600 dark:text-[#888888]">{r.docType}</td>
                    <td className="p-2.5 text-slate-600 dark:text-[#888888]">{r.vigencia}</td>
                    <td className="p-2.5">
                      {r.status === 'valid' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[10px]">
                          VÁLIDO
                        </span>
                      )}
                      {r.status === 'warning' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium text-[10px]">
                          ≤15 DÍAS
                        </span>
                      )}
                      {r.status === 'error' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium text-[10px]">
                          VENCIDO
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-500 dark:text-[#888888]">{r.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={() => {
              audio.playClick();
              onShowToast('Plantilla oficial TERRATECH_FORMATO_CARGA.xlsx descargada', 'download');
            }}
            className="text-xs text-slate-600 dark:text-[#888888] hover:text-white flex items-center gap-1 font-sans transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Descargar Plantilla Excel
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
              onClick={handleProcess}
              disabled={isProcessing}
              className="h-8 px-3 rounded-md bg-white text-black hover:bg-[#EAEAEA] disabled:opacity-50 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-none border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isProcessing ? 'hourglass_top' : 'task_alt'}
              </span>
              {isProcessing ? 'Procesando Lote...' : 'Validar y Acreditar Lote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
