'use client';

import React from 'react';

interface InspectorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const InspectorProfileModal: React.FC<InspectorProfileModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleVerifyToken = () => {
    onShowToast('Token Criptográfico PKI #99482 validado con Entidad de Registro Reniec/MINSA', 'verified');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-foundry-blue dark:text-sky-400">
              badge
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-foundry-titanium font-mono">
                PERFIL DEL AUDITOR SSOMA EN GUARDIA
              </h3>
              <p className="text-xs text-slate-500 dark:text-foundry-aluminum font-mono">
                Credencial de Inspección y Firma Digital Autorizada
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

        {/* User Card */}
        <div className="p-3.5 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center gap-4">
          <img
            src="/avatars/sarah_jenkins.jpg"
            alt="Ing. Sarah Jenkins"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-foundry-blue border-2 border-white dark:border-foundry-panel shadow-sm flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-foundry-titanium truncate font-mono">
                Ing. Sarah Jenkins
              </h4>
              <span className="px-2 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                NIVEL IV
              </span>
            </div>
            <span className="text-xs text-slate-600 dark:text-foundry-aluminum">
              Superintendente de Seguridad y Salud Ocupacional
            </span>
            <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-semibold pt-0.5">
              CIP #184209 • CONSTRUCTORA ANDINA
            </span>
          </div>
        </div>

        {/* Technical Badges */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <span className="text-slate-600 dark:text-foundry-aluminum">Token Criptográfico de Firma:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-foundry-titanium">PKI-AAQ-2026-99482 (ACTIVO)</span>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex items-center justify-between">
            <span className="text-slate-600 dark:text-foundry-aluminum">Fiscalización OSINERGMIN / SUNAFIL:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">HABILITADA NACIONAL</span>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border shadow-hardware flex flex-col gap-1.5">
            <span className="font-bold text-slate-700 dark:text-foundry-titanium">Certificaciones Vigentes:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-foundry-aluminum text-[11px]">
              <li>Auditor Líder ISO 45001:2018 (IRCA Cert. #581902)</li>
              <li>Especialista en Seguridad Minera D.S. 024-2016-EM / D.S. 023-2017-EM</li>
              <li>Brigadista de Rescate Minero Subterráneo y Tajo Abierto</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={handleVerifyToken}
            className="text-xs text-slate-600 dark:text-[#888888] hover:text-white font-sans flex items-center gap-1 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Verificar Token PKI
          </button>
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
