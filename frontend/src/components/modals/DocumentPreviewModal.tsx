'use client';

import React from 'react';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: {
    id: string;
    name: string;
    statusText: string;
    expiryDate: string;
    status: 'conforme' | 'por_vencer' | 'vencido' | 'no_aplica';
  } | null;
  workerName: string;
  workerDni: string;
  workerFotocheck: string;
  onShowToast: (message: string, icon?: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentData,
  workerName,
  workerDni,
  workerFotocheck,
  onShowToast,
}) => {
  if (!isOpen || !documentData) return null;

  const isConforme = documentData.status === 'conforme';
  const isPorVencer = documentData.status === 'por_vencer';
  const isVencido = documentData.status === 'vencido';

  // Archivo y entidad simulada según tipo de documento
  let issuer = 'Clínica Ocupacional San José (MINSA #4491)';
  let filename = `EMO_7C_${workerDni}_SIGNED.pdf`;
  let fileTypeLabel = 'Certificado Médico Ocupacional Anexo 7C';
  let norm = 'D.S. 024-2016-EM / R.M. 312-2011-MINSA';

  if (documentData.name.toLowerCase().includes('sctr salud')) {
    issuer = 'Rímac Seguros y Reaseguros S.A.';
    filename = `POLIZA_SCTR_SALUD_RIMAC_${workerDni}.pdf`;
    fileTypeLabel = 'Póliza de Seguro Complementario de Trabajo de Riesgo (Salud)';
    norm = 'Ley 26790 / D.S. 003-98-SA • Endoso Anglo American';
  } else if (documentData.name.toLowerCase().includes('sctr pensión') || documentData.name.toLowerCase().includes('pension')) {
    issuer = 'ONP / Rímac Seguros Vida';
    filename = `CONSTANCIA_SCTR_PENSION_${workerDni}.pdf`;
    fileTypeLabel = 'Póliza SCTR Pensión y Cobertura de Invalidez';
    norm = 'D.S. 003-98-SA • Cobertura 100% Mina Subterránea / Tajo';
  } else if (documentData.name.toLowerCase().includes('inducción') || documentData.name.toLowerCase().includes('induccion')) {
    issuer = 'Centro de Homologación SSOMA Anglo American Quellaveco';
    filename = `CERTIFICADO_INDUCCION_MINA_${workerDni}.pdf`;
    fileTypeLabel = 'Constancia de Inducción General y Específica Mina';
    norm = 'Anexo 4 & 5 D.S. 024-2016-EM • Calificación 19/20';
  } else if (documentData.name.toLowerCase().includes('licencia') || documentData.name.toLowerCase().includes('supv')) {
    issuer = 'Gerencia de Mina / MTC Autorización Interna';
    filename = `LICENCIA_INTERNA_4X4_${workerDni}.pdf`;
    fileTypeLabel = 'Autorización Interna de Manejo en Tajo y Vías de Acarreo';
    norm = 'Manejo Defensivo en Alta Cota 4,200m • Vigente';
  }

  const handleDownload = () => {
    onShowToast(`Descargando ${filename} con sellos oficiales...`, 'download');
  };

  const handleVerifyHash = () => {
    onShowToast('Firma digital SHA-256 verificada con servidor central Quellaveco', 'verified');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[22px] text-slate-700 dark:text-[#EDEDED] flex-shrink-0">
              verified
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-[#EDEDED] truncate font-sans">
                Corroboración de Archivo: {documentData.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888] font-mono truncate">
                {workerName} • DNI {workerDni} • Fotocheck #{workerFotocheck}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors flex-shrink-0"
            type="button"
            title="Cerrar vista previa"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* File Metainfo Card */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#262626] flex flex-col gap-2 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-rose-500 flex-shrink-0">
                picture_as_pdf
              </span>
              <span className="font-semibold text-slate-900 dark:text-[#EDEDED] truncate">
                {filename}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#666666]">
                (2.14 MB)
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                isConforme
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : isPorVencer
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {documentData.statusText}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-[#1F1F1F] text-[11px]">
            <div>
              <span className="text-slate-500 dark:text-[#666666] block">Entidad Emisora:</span>
              <span className="text-slate-800 dark:text-[#EDEDED] font-medium">{issuer}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#666666] block">Normativa / Endoso:</span>
              <span className="text-slate-800 dark:text-[#EDEDED] font-medium">{norm}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#666666] block">Fecha de Vigencia:</span>
              <span className="text-slate-800 dark:text-[#EDEDED] font-medium">{documentData.expiryDate}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#666666] block">Huella SHA-256:</span>
              <span className="text-slate-600 dark:text-[#888888] truncate block">8f4c9102b3e4...d901a</span>
            </div>
          </div>
        </div>

        {/* Visual Document Content Representation */}
        <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#262626] flex flex-col gap-3 font-sans text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1F1F1F]">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-[#666666] uppercase tracking-wider block font-mono">
                DOCUMENTO TÉCNICO REGISTRADO
              </span>
              <span className="font-semibold text-slate-900 dark:text-[#EDEDED] text-sm">
                {fileTypeLabel}
              </span>
            </div>
            <div className="px-2 py-1 rounded bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] text-[10px] font-mono text-slate-700 dark:text-[#EDEDED]">
              SELLO DIGITAL ACTIVO
            </div>
          </div>

          <div className="space-y-2 text-slate-700 dark:text-[#888888] text-[11px] leading-relaxed">
            <p>
              Por medio del presente documento oficial, la entidad <strong>{issuer}</strong> certifica que el colaborador <strong>{workerName}</strong> (DNI: {workerDni}) ha completado satisfactoriamente los protocolos y requisitos exigidos para el ingreso a la unidad minera <strong>U.M. Quellaveco (4,200 msnm)</strong>.
            </p>
            <div className="p-2.5 rounded bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#1F1F1F] space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span>Resultado Técnico:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{documentData.statusText}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha de Acreditación:</span>
                <span className="text-slate-800 dark:text-[#EDEDED]">Registrado y homologado en sistema</span>
              </div>
              <div className="flex justify-between">
                <span>Endoso Central:</span>
                <span className="text-slate-800 dark:text-[#EDEDED]">Anglo American Quellaveco S.A.</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-[#666666] italic">
              Este expediente cuenta con firma criptográfica PKI registrada en la base inmutable de SSOMA para auditorías de OSINERGMIN y SUNAFIL.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="h-8 px-3 rounded-md bg-white text-black hover:bg-[#EAEAEA] font-medium text-xs flex items-center gap-1.5 transition-colors shadow-none border-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              Descargar Archivo (.PDF)
            </button>
            <button
              onClick={handleVerifyHash}
              className="h-8 px-3 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium flex items-center gap-1.5 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Validar Firma SHA-256
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
    </div>
  );
};
