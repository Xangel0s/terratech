'use client';

import React, { useState, useEffect } from 'react';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const COMPILATION_STAGES = [
  { percent: 20, file: 'Generando árbol de directorios y manifiesto SHA-256...' },
  { percent: 45, file: 'Comprimiendo EMO_MariaTapia_Anexo7C.pdf (2 de 8)...' },
  { percent: 70, file: 'Validando Póliza SCTR Rimac con endoso Quellaveco (5 de 8)...' },
  { percent: 88, file: 'Generando matriz analítica Excel (Anexo 04 OSINERGMIN)...' },
  { percent: 100, file: 'Compilación finalizada: 14 certificados firmados con SHA256' },
];

export const DossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStageIndex(0);
      setIsCompleted(false);
      return;
    }

    // Simulación fluida de compilación en tiempo real (Teatro de Valor Operativo)
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < COMPILATION_STAGES.length - 1) {
          return prev + 1;
        } else {
          setIsCompleted(true);
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStage = COMPILATION_STAGES[stageIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-slate-800 dark:text-[#EDEDED]">
              archive
            </span>
            <h3 className="font-sans text-sm sm:text-base font-semibold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              Compilador de dossier ZIP + Excel
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

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-[#888888] leading-relaxed font-sans">
          Empaquetando expedientes de todo el personal asignado a Mina Quellaveco con certificados médicos EMO Anexo 7C, pólizas SCTR con endoso y constancias de inducción homologadas en formato ZIP estándar y matriz analítica en Excel.
        </p>

        {/* Animated Progress Box */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-slate-700 dark:text-[#EDEDED] font-medium flex items-center gap-2">
              {!isCompleted ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              ) : (
                <span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>
              )}
              Procesando matriz táctica
            </span>
            <span className={`font-medium font-mono ${isCompleted ? 'text-emerald-500' : 'text-slate-900 dark:text-[#EDEDED]'}`}>
              {currentStage.percent}% Listo
            </span>
          </div>

          {/* Striped Animated Bar */}
          <div className="w-full bg-slate-200 dark:bg-[#111111] h-1.5 rounded-full overflow-hidden border border-slate-300 dark:border-[#262626]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-white'
              }`}
              style={{ width: `${currentStage.percent}%` }}
            ></div>
          </div>

          {/* Real-time file processing stream */}
          <div className="flex items-center justify-between font-sans text-xs text-slate-600 dark:text-[#888888] pt-0.5">
            <span className="truncate pr-2 text-slate-700 dark:text-[#EDEDED] font-medium">
              {currentStage.file}
            </span>
            <span className="flex-shrink-0 text-emerald-500 font-mono text-[10px] font-medium">
              SHA256 VALID
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 dark:text-[#666666] border-t border-slate-200/60 dark:border-[#1F1F1F] pt-2">
            <span className="truncate font-medium font-mono text-xs">TERRATECH_SSOMA_MATRIZ_2025.zip</span>
            <span className="flex-shrink-0">48.4 MB • Listo para Garita</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium transition-colors"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="h-8 px-3.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 transition-colors bg-white text-black hover:bg-[#EAEAEA] border-0"
            onClick={onDownload}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isCompleted ? 'download_done' : 'download'}
            </span>
            DESCARGAR ARCHIVO (.ZIP)
          </button>
        </div>
      </div>
    </div>
  );
};
