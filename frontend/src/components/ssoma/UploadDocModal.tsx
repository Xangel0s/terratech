'use client';

import React, { useState } from 'react';

interface UploadDocModalProps {
  isOpen: boolean;
  workerName: string;
  docType: string;
  onClose: () => void;
  onSubmit: (workerName: string, docType: string, fileName: string) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  workerName,
  docType,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateSelect = () => {
    setSelectedFile(`${docType.replace(/\s+/g, '_')}_${workerName.split(' ')[0]}.pdf`);
  };

  const handleConfirm = () => {
    const fileName = selectedFile || `${docType.replace(/\s+/g, '_')}_OFICIAL.pdf`;
    onSubmit(workerName, docType, fileName);
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-slate-800 dark:text-[#EDEDED]">
              upload_file
            </span>
            <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-[#EDEDED]">
              GESTIÓN DOCUMENTAL SSOMA
            </h3>
          </div>
          <button
            className="text-slate-400 hover:text-slate-700 dark:text-[#666666] dark:hover:text-[#EDEDED] p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-[#888888]">
          <p className="font-sans">
            Cargue el documento digitalizado para el colaborador{' '}
            <strong className="text-slate-900 dark:text-[#EDEDED]">{workerName}</strong>:
          </p>

          <div className="px-3 py-2 rounded-md bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] font-sans text-xs text-slate-700 dark:text-[#EDEDED] flex items-center justify-between">
            <span>Requisito: <strong className="font-medium">{docType}</strong></span>
            <span className="text-slate-500 dark:text-[#888888] font-mono text-[11px] font-medium">D.S. 024-2016-EM</span>
          </div>

          <div
            className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              selectedFile
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-300 dark:border-[#262626] hover:border-[#404040] bg-slate-50 dark:bg-black'
            }`}
            onClick={handleSimulateSelect}
          >
            <span
              className={`material-symbols-outlined text-[32px] ${
                selectedFile ? 'text-emerald-500' : 'text-slate-600 dark:text-[#888888]'
              }`}
            >
              {selectedFile ? 'task' : 'cloud_upload'}
            </span>
            <span className="text-slate-800 dark:text-[#EDEDED] font-medium text-xs text-center font-sans">
              {selectedFile
                ? selectedFile
                : 'Haga clic para seleccionar archivo o arrastre el PDF aquí'}
            </span>
            <span className="text-[11px] font-sans text-slate-400 dark:text-[#666666]">
              {selectedFile
                ? 'Archivo listo para firma criptográfica SHA-256'
                : 'Máx 15MB • Solo PDF o ZIP'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
          <button
            className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-[#EAEAEA] font-medium text-xs flex items-center gap-1.5 transition-colors border-0"
            onClick={handleConfirm}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            CONFIRMAR ACTUALIZACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};
