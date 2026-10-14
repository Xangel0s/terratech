'use client';

import React from 'react';
import { TerratechLogo } from '@/components/ui/TerratechLogo';

interface SidebarProps {
  currentTab: 'ssoma' | 'fleet' | 'dashboard' | 'personnel';
  onSelectTab: (tab: 'ssoma' | 'fleet' | 'dashboard' | 'personnel') => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenReports?: () => void;
  onOpenPlantConfig?: () => void;
  onOpenInspectorProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapsed,
  isMobileOpen,
  onCloseMobile,
  onOpenReports,
  onOpenPlantConfig,
  onOpenInspectorProfile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-45 lg:hidden transition-opacity duration-150"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Tactical Aside: Vercel Settings / Dashboard Flat Standard */}
      <aside
        id="sidebar"
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-black border-r border-slate-200 dark:border-[#262626] z-50 flex flex-col justify-between select-none transition-[width] duration-150 ease-out will-change-[width] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-[4.5rem] sidebar-collapsed' : 'w-64'}`}
      >
        <div className="flex flex-col">
          {/* Brand Bar with Collapse Button */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-[#262626] bg-white dark:bg-black relative">
            <TerratechLogo collapsed={isCollapsed} />

            <div className="flex items-center">
              {/* Desktop toggle button */}
              <button
                aria-label="Colapsar panel"
                className="hidden lg:flex w-7 h-7 rounded-md border border-slate-200 dark:border-[#262626] bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white items-center justify-center transition-colors active:scale-95"
                onClick={onToggleCollapsed}
                title="Colapsar o expandir panel lateral"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform duration-150 ease-out ${
                    isCollapsed ? 'rotate-180' : ''
                  }`}
                >
                  chevron_left
                </span>
              </button>
              {/* Mobile close button */}
              <button
                aria-label="Cerrar menú"
                className="lg:hidden w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] flex items-center justify-center transition-colors"
                onClick={onCloseMobile}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Micro Status Indicator */}
          {!isCollapsed && (
            <div className="px-4 py-2 border-b border-slate-100 dark:border-[#1F1F1F] flex items-center justify-between text-xs sidebar-hide-on-collapse">
              <span className="font-sans text-xs text-slate-500 dark:text-[#888888] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Matriz Táctica
              </span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-[#666666]">
                4,200m
              </span>
            </div>
          )}

          {/* Primary Navigation Links (Vercel Style) */}
          <nav className="flex flex-col gap-1 p-2.5">
            {/* Dashboard */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-xs font-sans font-medium active:scale-[0.99] ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dashboard General"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                dashboard
              </span>
              {!isCollapsed && <span className="sidebar-hide-on-collapse truncate">Dashboard</span>}
            </button>

            {/* Acreditaciones SSOMA (MVP 1) */}
            <button
              onClick={() => onSelectTab('ssoma')}
              className={`sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-xs font-sans font-medium active:scale-[0.99] ${
                currentTab === 'ssoma'
                  ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Acreditaciones SSOMA (Módulo 1)"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                verified_user
              </span>
              {!isCollapsed && (
                <span className="sidebar-hide-on-collapse truncate">Acreditaciones SSOMA</span>
              )}
            </button>

            {/* Flota & Checklists (MVP 2) */}
            <button
              onClick={() => onSelectTab('fleet')}
              className={`sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-xs font-sans font-medium active:scale-[0.99] ${
                currentTab === 'fleet'
                  ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Flota & Checklists Pre-Uso (Módulo 2)"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                fire_truck
              </span>
              {!isCollapsed && (
                <span className="sidebar-hide-on-collapse truncate">Flota &amp; Checklists</span>
              )}
            </button>

            {/* Directorio de Personal */}
            <button
              onClick={() => onSelectTab('personnel')}
              className={`sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-xs font-sans font-medium active:scale-[0.99] ${
                currentTab === 'personnel'
                  ? 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Directorio de Personal"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                badge
              </span>
              {!isCollapsed && (
                <span className="sidebar-hide-on-collapse truncate">Directorio Personal</span>
              )}
            </button>

            {/* Reportes & Datos */}
            <button
              onClick={onOpenReports}
              className="sidebar-nav-item flex items-center justify-between px-2.5 py-2 rounded-md text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white text-xs font-sans font-medium transition-colors active:scale-[0.99] w-full text-left"
              title="Reportes & Datos Oficiales"
              type="button"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                  analytics
                </span>
                {!isCollapsed && (
                  <span className="sidebar-hide-on-collapse truncate">Reportes &amp; Datos</span>
                )}
              </div>
              {!isCollapsed && (
                <span className="sidebar-hide-on-collapse text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1A1A1A] text-slate-500 dark:text-[#888888] border border-slate-200 dark:border-[#262626]">
                  PDF/XLS
                </span>
              )}
            </button>

            {/* Config. Planta */}
            <button
              onClick={onOpenPlantConfig}
              className="sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-md text-slate-600 dark:text-[#888888] hover:bg-slate-100 dark:hover:bg-[#111111] hover:text-slate-900 dark:hover:text-white text-xs font-sans font-medium transition-colors active:scale-[0.99] w-full text-left"
              title="Configuración de Planta Quellaveco"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-current">
                precision_manufacturing
              </span>
              {!isCollapsed && (
                <span className="sidebar-hide-on-collapse truncate">Config. Planta</span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer Widget: Inspector Profile & Connection Status (Vercel Style) */}
        <div className="flex flex-col">
          {/* User profile button */}
          <button
            onClick={onOpenInspectorProfile}
            type="button"
            className="p-3 border-t border-slate-200 dark:border-[#262626] bg-transparent hover:bg-slate-50 dark:hover:bg-[#111111] flex items-center gap-2.5 sidebar-nav-item text-left w-full transition-colors cursor-pointer"
            title="Ver Credencial de Ing. Sarah Jenkins"
          >
            <img
              src="/avatars/sarah_jenkins.jpg"
              alt="Ing. Sarah Jenkins"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-[#262626] flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1 sidebar-hide-on-collapse">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium text-xs text-slate-900 dark:text-white truncate">
                    Ing. Sarah Jenkins
                  </span>
                  <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 flex-shrink-0">
                    Nivel IV
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#888888] truncate font-sans">
                  CIP #184209 • SSOMA
                </span>
              </div>
            )}
          </button>

          {/* Connection telemetry bar */}
          {!isCollapsed && (
            <div className="p-3 border-t border-slate-200 dark:border-[#262626] bg-transparent flex flex-col gap-1.5 sidebar-hide-on-collapse text-xs">
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 dark:text-[#888888]">
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Garita 4,200m
                </span>
                <span className="text-emerald-500 font-medium text-[11px]">Enlace 100%</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-sans text-slate-400 dark:text-[#666666]">
                <span className="truncate">Quellaveco • Tajo</span>
                <span>SSL Pinned</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
