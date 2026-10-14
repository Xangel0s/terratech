'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WorkerProfile, FleetVehicle } from '@/types';
import { audio } from '@/services/audioService';
import { haptic } from '@/services/hapticService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workers: WorkerProfile[];
  vehicles: FleetVehicle[];
  onSelectWorker: (worker: WorkerProfile) => void;
  onSelectVehicle: (vehicle: FleetVehicle) => void;
  onExecuteCommand: (cmdId: string) => void;
}

interface CommandItem {
  id: string;
  category: 'COMANDO' | 'PERSONAL' | 'FLOTA';
  title: string;
  subtitle: string;
  badge?: string;
  icon: string;
  action: () => void;
}

const SYSTEM_COMMANDS = [
  { id: 'cmd-guardia', title: 'Generar Acta de Entrega de Guardia (Handover)', subtitle: 'Cierre de turno 14x7 con doble firma digital', icon: 'assignment_turned_in' },
  { id: 'cmd-sync', title: 'Forzar Sincronización Batch Outbox (IndexedDB)', subtitle: 'Transmitir eventos locales en cola a Anglo American', icon: 'sync' },
  { id: 'cmd-dossier', title: 'Compilar Dossier de Acreditación (ZIP + Excel)', subtitle: 'Generar matriz analítica oficial con hashes SHA-256', icon: 'archive' },
  { id: 'cmd-carga', title: 'Carga Masiva de Acreditaciones (Lote CSV / ZIP)', subtitle: 'Ingestión por nómina de cuadrilla con pre-diagnóstico', icon: 'upload_file' },
  { id: 'cmd-garita', title: 'Ajustes de Garita, Torniquetes y Molinetes', subtitle: 'Configurar timeouts NFC, sensórica y alcoholemia', icon: 'sensors' },
  { id: 'cmd-politicas', title: 'Políticas de Bloqueo D.S. 024-2016-EM', subtitle: 'Tolerancias cero y umbrales preventivos de acceso', icon: 'lock_clock' },
  { id: 'cmd-auditoria', title: 'Registro de Auditoría Criptográfica SUNAFIL', subtitle: 'Libro mayor inmutable con trazabilidad forense', icon: 'history' },
  { id: 'cmd-dark', title: 'Alternar Modo Consola / Plano Técnico', subtitle: 'Cambiar tema de alto contraste para sala de control', icon: 'contrast' },
  { id: 'cmd-audio', title: 'Alternar Audio y Háptica Industrial', subtitle: 'Silenciar o activar sintetizador Web Audio API', icon: 'volume_up' },
  { id: 'cmd-tab-ssoma', title: 'Navegar a Control de Acreditaciones SSOMA', subtitle: 'Módulo 1: Semáforo y expedientes de colaboradores', icon: 'verified_user' },
  { id: 'cmd-tab-flota', title: 'Navegar a Flota & Checklists Pre-Uso', subtitle: 'Módulo 2: Inspección de maquinaria y parada crítica', icon: 'fire_truck' },
  { id: 'cmd-tab-personal', title: 'Navegar a Directorio Maestro de Personal', subtitle: 'Módulo 3: Fichas individuales y régimen de guardia', icon: 'badge' },
  { id: 'cmd-tab-dash', title: 'Navegar a Panel Ejecutivo & Telemetría', subtitle: 'Módulo 4: KPIs de cumplimiento y cola offline', icon: 'dashboard' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  workers,
  vehicles,
  onSelectWorker,
  onSelectVehicle,
  onExecuteCommand,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      audio.playClick();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Construir catálogo de búsqueda dinámico
  const allItems: CommandItem[] = [
    // Comandos de sistema
    ...SYSTEM_COMMANDS.map((cmd) => ({
      id: cmd.id,
      category: 'COMANDO' as const,
      title: cmd.title,
      subtitle: cmd.subtitle,
      icon: cmd.icon,
      action: () => {
        onExecuteCommand(cmd.id);
        onClose();
      },
    })),
    // Trabajadores
    ...workers.map((w) => ({
      id: `worker-${w.id}`,
      category: 'PERSONAL' as const,
      title: `${w.fullName} • DNI ${w.dni}`,
      subtitle: `${w.role} • ${w.cuadrilla} • ${w.guardia}`,
      badge: w.statusLabel || w.status.toUpperCase(),
      icon: 'person',
      action: () => {
        onSelectWorker(w);
        onClose();
      },
    })),
    // Flota
    ...vehicles.map((v) => ({
      id: `vehicle-${v.id}`,
      category: 'FLOTA' as const,
      title: `${v.code} (${v.plate}) • ${v.brandModel}`,
      subtitle: `Tipo: ${v.type} • Op: ${v.assignedOperator} • ${v.odometerOrHours}`,
      badge: v.status === 'operativo' ? 'OPERATIVO' : v.status === 'observado' ? 'OBSERVADO' : 'PARADA CRÍTICA',
      icon: 'fire_truck',
      action: () => {
        onSelectVehicle(v);
        onClose();
      },
    })),
  ];

  // Filtrar según query
  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  // Manejo de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      audio.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      audio.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        audio.playChime();
        haptic.vibrateClick();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0A0A0A] border border-[#262626] rounded-xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden text-[#EDEDED] font-sans"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-3.5 py-3 border-b border-[#262626] bg-[#000000]">
          <span className="material-symbols-outlined text-[18px] text-[#888888]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Escriba un comando (> sync), DNI (44892105), máquina (CAM-042)..."
            className="w-full bg-transparent border-0 text-xs sm:text-sm focus:ring-0 text-[#EDEDED] placeholder:text-[#666666] outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#666666] hover:text-[#EDEDED] p-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <span className="text-[10px] text-[#888888] uppercase px-1.5 py-0.5 rounded-md bg-[#111111] border border-[#262626] flex-shrink-0 font-mono">
            ESC
          </span>
        </div>

        {/* Continuous Results List - Vercel Omnibar Style */}
        <div className="p-1.5 space-y-0.5 max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#666666] text-xs">
              <span className="material-symbols-outlined text-[28px] text-[#666666] block mb-2">
                search_off
              </span>
              No se encontraron comandos, colaboradores ni maquinaria con ese criterio.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    audio.playChime();
                    haptic.vibrateClick();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#888888] hover:bg-[#111111] hover:text-[#EDEDED]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[18px] flex-shrink-0 transition-colors ${
                        isSelected ? 'text-white' : 'text-[#888888]'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium text-xs truncate ${
                            isSelected ? 'text-white' : 'text-[#EDEDED]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="font-mono text-[9px] text-[#666666] border border-[#262626] px-1 py-0.2 rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#666666] font-sans truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.badge && (
                      <span className="font-mono text-[10px] text-[#888888] border border-[#262626] px-1.5 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <span className="font-mono text-[10px] text-white font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">keyboard_return</span>
                        ENTER
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3.5 py-2 bg-[#000000] border-t border-[#262626] flex items-center justify-between text-[11px] text-[#666666]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navegar</span>
            <span>↵ Ejecutar</span>
            <span>ESC Cerrar</span>
          </div>
          <span className="text-[#888888] font-medium font-sans">
            Terratech Command
          </span>
        </div>
      </div>
    </div>
  );
};
