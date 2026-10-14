'use client';

import React, { useState } from 'react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  hash: string;
  status: 'AUDITADO' | 'ALERTA' | 'BLOQUEO';
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  { id: 'log-101', timestamp: '12/10/2026 22:15:40', actor: 'Ing. Sarah Jenkins (CIP 184209)', action: 'DOCUMENT_UPLOAD', target: 'María Elena Tapia • EMO Anexo 7C', hash: 'e4a8b912c0fa43e8...', status: 'AUDITADO' },
  { id: 'log-102', timestamp: '12/10/2026 21:40:12', actor: 'Garita 4,200m • Torniquete Alfa', action: 'BIOMETRIC_PASS', target: 'Javier Paredes Silva • Pase Autorizado', hash: '9b12fe3480ac22d1...', status: 'AUDITADO' },
  { id: 'log-103', timestamp: '12/10/2026 19:22:05', actor: 'Inspección Mecánica Taller', action: 'PRE_USO_LOCKOUT', target: 'Volquete VOL-108 • Fuga Hidráulica Crítica', hash: '71cf4081da22e987...', status: 'BLOQUEO' },
  { id: 'log-104', timestamp: '12/10/2026 18:05:33', actor: 'Motor de Cumplimiento D.S. 024', action: 'GATE_LOCKOUT', target: 'Roberto Arteaga • EMO Caducado', hash: 'a19ed450ff812901...', status: 'BLOQUEO' },
  { id: 'log-105', timestamp: '12/10/2026 16:30:18', actor: 'Anglo American SSOMA Central', action: 'SYNC_RECONCILIATION', target: 'Consorcio Andina • Lote 24 Registros', hash: '33cb09ef8841a540...', status: 'AUDITADO' },
  { id: 'log-106', timestamp: '12/10/2026 14:12:59', actor: 'Ing. Sarah Jenkins (CIP 184209)', action: 'POLICY_UPDATE', target: 'Umbral SCTR Alerta Reducido a 15d', hash: '5f91ae2201bba876...', status: 'ALERTA' },
];

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLogs = SAMPLE_LOGS.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCsv = () => {
    onShowToast('Bitácora criptográfica TERRATECH_AUDIT_TRAIL_2026.csv generada con firma SHA-256', 'history');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-[#262626] max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-emerald-500">
              history
            </span>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-slate-900 dark:text-[#EDEDED]">
                Registro de auditoría SSOMA &amp; trazabilidad SUNAFIL
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888]">
                Libro Criptográfico Inmutable • Huellas Digitales SHA-256 por Transacción
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

        {/* Search bar & Metadata */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-50 dark:bg-foundry-surface border border-slate-200 dark:border-foundry-border flex-1 max-w-md shadow-hardware">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              type="text"
              placeholder="Buscar por actor, acción o hash criptográfico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 text-xs w-full focus:ring-0 text-slate-800 dark:text-foundry-titanium placeholder:text-slate-400 font-mono"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-foundry-aluminum">
            <span className="px-2 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
              LEDGER INMUTABLE: 6 ENTRADAS
            </span>
          </div>
        </div>

        {/* Audit Table */}
        <div className="border border-slate-200 dark:border-foundry-border rounded-sm overflow-hidden bg-slate-50/50 dark:bg-foundry-surface shadow-hardware">
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-foundry-panel text-[10px] text-slate-500 dark:text-foundry-aluminum uppercase tracking-wider sticky top-0 border-b border-slate-200 dark:border-foundry-border">
                <tr>
                  <th className="p-2.5">Fecha y Hora (PET)</th>
                  <th className="p-2.5">Actor / Dispositivo</th>
                  <th className="p-2.5">Acción</th>
                  <th className="p-2.5">Detalle / Objetivo</th>
                  <th className="p-2.5">Hash SHA-256</th>
                  <th className="p-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-foundry-border text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white dark:hover:bg-foundry-border/40">
                    <td className="p-2.5 text-slate-500 dark:text-foundry-aluminum whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2.5 font-bold text-slate-800 dark:text-foundry-titanium font-sans whitespace-nowrap">{log.actor}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-foundry-panel text-slate-800 dark:text-foundry-titanium font-bold text-[10px] border border-transparent dark:border-foundry-border">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-foundry-titanium font-sans">{log.target}</td>
                    <td className="p-2.5 text-slate-400 dark:text-foundry-muted font-mono text-[10px]">{log.hash}</td>
                    <td className="p-2.5">
                      {log.status === 'AUDITADO' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                          CONFORME
                        </span>
                      )}
                      {log.status === 'BLOQUEO' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 font-bold text-[10px]">
                          BLOQUEO
                        </span>
                      )}
                      {log.status === 'ALERTA' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold text-[10px]">
                          ALERTA
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1F1F1F]">
          <button
            onClick={handleExportCsv}
            className="text-xs text-slate-600 dark:text-[#888888] hover:text-white flex items-center gap-1 font-sans font-medium transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Exportar Bitácora Criptográfica (.CSV)
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
