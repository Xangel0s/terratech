'use client';

import React, { useState } from 'react';
import { WorkerProfile } from '@/types';
import { DocumentPreviewModal } from '@/components/modals/DocumentPreviewModal';

interface WorkerCardProps {
  worker: WorkerProfile;
  onOpenUpload: (workerName: string, docType: string) => void;
  onAuditPass: (workerName: string) => void;
  onToggleBlock: (workerId: string, currentStatus: string) => void;
  onShowToast: (message: string, icon?: string) => void;
  onOpenMedicalRecord?: (worker: WorkerProfile) => void;
  onOpenFotocheck?: (worker: WorkerProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = React.memo(({
  worker,
  onOpenUpload,
  onAuditPass,
  onToggleBlock,
  onShowToast,
  onOpenMedicalRecord,
  onOpenFotocheck,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<{
    id: string;
    name: string;
    statusText: string;
    expiryDate: string;
    status: 'conforme' | 'por_vencer' | 'vencido' | 'no_aplica';
  } | null>(null);

  // Status Styling Helpers
  const isApto = worker.status === 'apto';
  const isPorVencer = worker.status === 'por_vencer';
  const isBloqueado = worker.status === 'bloqueado';

  // Borde y fondo Vercel Dark (#0A0A0A con border-[#262626])
  const statusBadge = () => {
    if (isApto) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-[#111111] text-[#EDEDED] border border-[#262626] font-sans text-xs font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {worker.statusLabel || 'Apto para ingreso'}
        </span>
      );
    }
    if (isPorVencer) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans text-xs font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {worker.statusLabel || 'Por vencer (≤15 días)'}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-sans text-xs font-medium flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {worker.statusLabel || 'Acceso bloqueado'}
      </span>
    );
  };

  return (
    <div
      className="worker-card flex flex-col rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] hover:border-slate-400 dark:hover:border-[#404040] transition-colors p-3.5 sm:p-4 gap-3.5 relative"
    >
      {/* Header: Avatar, Info, Badges & General Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-[#1F1F1F]">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            {worker.avatarUrl ? (
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-slate-200 dark:border-[#262626]"
              />
            ) : (
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${worker.avatarBg} ${worker.avatarColor} flex items-center justify-center font-mono text-xs font-bold border border-slate-200 dark:border-[#262626]`}
              >
                {worker.avatarInitials}
              </div>
            )}
            {worker.biometricVerified ? (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-[#0A0A0A] flex items-center justify-center text-white"
                title="Verificación Biométrica Garita OK"
              >
                <span className="material-symbols-outlined text-[10px]">check</span>
              </span>
            ) : (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white dark:border-[#0A0A0A] flex items-center justify-center text-white"
                title="Sin pase biométrico"
              >
                <span className="material-symbols-outlined text-[9px]">lock</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-tight font-sans">
                {worker.fullName}
              </h3>
              {/* Telemetry Chips: DNI, Fotocheck, CIP con números monoespaciados limpios */}
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-[#EDEDED] border border-slate-200 dark:border-[#262626] font-mono text-[11px] font-medium tracking-tight">
                DNI {worker.dni}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-[#888888] border border-slate-200 dark:border-[#262626] font-mono text-[11px] font-medium tracking-tight">
                FOTOCHECK #{worker.fotocheck}
              </span>
              {worker.cip && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-medium tracking-tight">
                  CIP #{worker.cip}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-slate-500 dark:text-[#888888] font-sans">
              <span className="font-medium text-slate-700 dark:text-[#EDEDED]">
                {worker.role} • {worker.specialty}
              </span>
              <span className="text-slate-300 dark:text-[#333333] hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-[#888888] font-sans text-xs">
                {worker.cuadrilla} • {worker.guardia}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 self-stretch lg:self-center pt-1 lg:pt-0">
          {statusBadge()}

          {/* 3-Dots Dropdown Menu */}
          <div className="relative">
            <button
              className="h-8 w-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#262626]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              aria-label="Opciones de trabajador"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-md bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] shadow-xl py-1 z-40 flex flex-col font-sans text-xs">
                <button
                  className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenMedicalRecord) {
                      onOpenMedicalRecord(worker);
                    } else {
                      onShowToast(`Abriendo Anexo 7C de ${worker.fullName}`, 'health_and_safety');
                    }
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-500">
                    health_and_safety
                  </span>
                  Ver Ficha Médica (Anexo 7C)
                </button>

                <button
                  className="px-3.5 py-2 text-left text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2 font-medium"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUpload(worker.fullName, 'Póliza SCTR Salud y Pensión');
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-500">
                    policy
                  </span>
                  Cargar / Endosar SCTR
                </button>

                <button
                  className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenFotocheck) {
                      onOpenFotocheck(worker);
                    } else {
                      onShowToast(`Generando Fotocheck para ${worker.fullName}`, 'badge');
                    }
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-[#888888]">
                    badge
                  </span>
                  Imprimir Fotocheck
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-[#1F1F1F]"></div>

                <button
                  className={`px-3.5 py-2 text-left text-xs flex items-center gap-2 font-medium ${
                    isBloqueado
                      ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[#1A1A1A]'
                      : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#1A1A1A]'
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleBlock(worker.id, worker.status);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isBloqueado ? 'lock_open' : 'lock'}
                  </span>
                  {isBloqueado ? 'Levantar Bloqueo en Garita' : 'Bloquear en Garita'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grilla Tabular Continua: Data Density Vercel sin iconos circulares repetitivos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[#1F1F1F] py-2 border-y border-slate-100 dark:border-[#1F1F1F]">
        {worker.credentials.map((cred) => {
          const isDocConforme = cred.status === 'conforme';
          const isDocPorVencer = cred.status === 'por_vencer';
          const isDocVencido = cred.status === 'vencido';

          return (
            <button
              key={cred.id}
              onClick={() => setSelectedDocForPreview(cred)}
              className="group/cell text-left flex flex-col justify-between px-3 py-1.5 sm:first:pl-0 sm:last:pr-0 hover:bg-slate-100/70 dark:hover:bg-[#111111] rounded transition-colors"
              type="button"
              title="Clic para ver y corroborar el archivo adjunto"
            >
              <div className="flex items-center justify-between gap-1 mb-0.5 w-full">
                <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-[#888888] truncate">
                  {cred.name}
                </span>
                <span className="material-symbols-outlined text-[13px] text-slate-400 dark:text-[#666666] opacity-0 group-hover/cell:opacity-100 transition-opacity flex-shrink-0">
                  visibility
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isDocConforme && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                {isDocPorVencer && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />}
                {isDocVencido && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />}
                {cred.status === 'no_aplica' && <span className="w-1.5 h-1.5 rounded-full bg-[#555555] flex-shrink-0" />}
                <span className={`font-sans text-xs ${
                  isDocVencido
                    ? 'text-rose-500 dark:text-rose-400 font-medium'
                    : isDocPorVencer
                    ? 'text-amber-600 dark:text-amber-400 font-medium'
                    : 'text-slate-900 dark:text-[#EDEDED] font-medium'
                } leading-tight truncate`}>
                  {cred.statusText}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 dark:text-[#666666] leading-tight mt-0.5 truncate">
                {cred.expiryDate.includes('20') ? `Exp: ${cred.expiryDate}` : cred.expiryDate}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Information Bar & Context Action Buttons (Vercel Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
        {isBloqueado ? (
          <div className="flex items-start sm:items-center gap-2 text-rose-800 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-500/10 px-3 py-1.5 rounded-md border border-rose-200 dark:border-rose-500/20 flex-1">
            <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[16px] flex-shrink-0 mt-0.5 sm:mt-0">
              error
            </span>
            <span className="font-sans text-xs leading-tight">
              Bloqueo en Garita Quellaveco: Requiere Certificado Anexo 7C vigente (D.S. 024-2016-EM)
            </span>
          </div>
        ) : isPorVencer ? (
          <div className="flex items-start sm:items-center gap-2 text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-500/20 flex-1">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[16px] flex-shrink-0 mt-0.5 sm:mt-0">
              warning
            </span>
            <span className="font-sans text-xs leading-tight">
              Póliza SCTR próxima a vencer: En trámite de renovación por RRHH antes del 31 de marzo
            </span>
          </div>
        ) : (
          <div className="flex items-start sm:items-center gap-2 text-slate-600 dark:text-[#888888] flex-1 font-sans text-xs">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-500 text-[16px] flex-shrink-0 mt-0.5 sm:mt-0">
              check_circle
            </span>
            <span className="leading-tight">
              Expediente auditado por Anglo SSOMA Central • Cero observaciones vigentes
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-shrink-0">
          {/* Botón Secundario Vercel: Expediente ZIP */}
          <button
            className="flex-1 sm:flex-initial h-8 px-3 rounded-md text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors bg-transparent text-slate-700 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626]"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-[#888888]">folder</span>
            <span>Expediente ZIP</span>
          </button>

          {isBloqueado ? (
            <button
              className="flex-1 sm:flex-initial h-8 px-3.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors"
              onClick={() => onOpenUpload(worker.fullName, 'Certificado EMO Anexo 7C')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Subir Anexo 7C</span>
            </button>
          ) : isPorVencer ? (
            <button
              className="flex-1 sm:flex-initial h-8 px-3.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors"
              onClick={() => onOpenUpload(worker.fullName, 'Póliza SCTR Salud y Pensión')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">autorenew</span>
              <span>Renovar SCTR</span>
            </button>
          ) : (
            <button
              className="flex-1 sm:flex-initial h-8 px-3.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-[#EAEAEA] text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors shadow-none border-0"
              onClick={() => onAuditPass(worker.fullName)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Auditar Pase</span>
            </button>
          )}
        </div>
      </div>

      {/* Accordion Details (Collapsible) */}
      {isAccordionOpen && (
        <div className="px-4 pb-3 pt-2.5 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-[#1F1F1F] rounded-b-lg animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[11px] text-slate-400 dark:text-[#666666] font-medium">
                Clínica / Examen Médico
              </span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED] font-sans">
                {worker.clinic || 'Clínica Ocupacional Autorizada MINSA'}
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#888888]">
                Protocolo D.S. 024-2016 Anexo 7C (Gran Altura 4,200m)
              </span>
              <button
                onClick={() => setSelectedDocForPreview(worker.credentials[0])}
                className="mt-1 h-6 px-2 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-[10px] font-mono flex items-center gap-1 transition-colors w-fit"
                type="button"
                title="Ver archivo original y verificar aprobación"
              >
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                <span>Ver Anexo 7C (.PDF)</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-sans text-[11px] text-slate-400 dark:text-[#666666] font-medium">
                Endoso Minero SCTR
              </span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED] font-sans">
                {worker.endorsement || 'Póliza con endoso vigente'}
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                Endosada a favor de Anglo American Quellaveco S.A.
              </span>
              <button
                onClick={() => setSelectedDocForPreview(worker.credentials[1] || worker.credentials[0])}
                className="mt-1 h-6 px-2 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-[10px] font-mono flex items-center gap-1 transition-colors w-fit"
                type="button"
                title="Ver póliza oficial y validar endoso"
              >
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                <span>Ver Póliza SCTR (.PDF)</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-sans text-[11px] text-slate-400 dark:text-[#666666] font-medium">
                Acreditación Operativa
              </span>
              <span className="font-semibold text-slate-800 dark:text-[#EDEDED] font-sans">
                {worker.authorizationNotes || 'Autorización de labores estándar'}
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-[#888888]">
                Registro de Inducción General Mina homologado
              </span>
              <button
                onClick={() => setSelectedDocForPreview(worker.credentials[3] || worker.credentials[0])}
                className="mt-1 h-6 px-2 rounded-md bg-transparent text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#262626] text-[10px] font-mono flex items-center gap-1 transition-colors w-fit"
                type="button"
                title="Ver constancia oficial de inducción"
              >
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                <span>Ver Constancia Inducción (.PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Corroboración de Archivo Subido */}
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
});

WorkerCard.displayName = 'WorkerCard';
