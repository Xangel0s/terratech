'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiStats } from '@/components/ssoma/KpiStats';
import { FilterToolbar } from '@/components/ssoma/FilterToolbar';
import { WorkerCard } from '@/components/ssoma/WorkerCard';
import { DossierModal } from '@/components/ssoma/DossierModal';
import { UploadDocModal } from '@/components/ssoma/UploadDocModal';
import { FleetModule } from '@/components/fleet/FleetModule';
import { PersonnelDirectory } from '@/components/personnel/PersonnelDirectory';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { Toast, ToastState } from '@/components/ui/Toast';
import { BulkUploadModal } from '@/components/modals/BulkUploadModal';
import { GaritaSettingsModal } from '@/components/modals/GaritaSettingsModal';
import { LockPoliciesModal } from '@/components/modals/LockPoliciesModal';
import { AuditTrailModal } from '@/components/modals/AuditTrailModal';
import { ReportsModal } from '@/components/modals/ReportsModal';
import { PlantConfigModal } from '@/components/modals/PlantConfigModal';
import { InspectorProfileModal } from '@/components/modals/InspectorProfileModal';
import { MedicalRecordModal } from '@/components/modals/MedicalRecordModal';
import { FotocheckModal } from '@/components/modals/FotocheckModal';
import { GatePassAuditModal } from '@/components/modals/GatePassAuditModal';
import { WorkerDetailModal } from '@/components/modals/WorkerDetailModal';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { BlackboxTicker } from '@/components/telemetry/BlackboxTicker';
import { ShiftHandoverModal } from '@/components/handover/ShiftHandoverModal';
import { audio } from '@/services/audioService';
import { haptic } from '@/services/hapticService';
import { WorkerProfile, FleetVehicle, OutboxEvent, ComplianceStatus } from '@/types';
import { db, initializeDatabase, INITIAL_WORKERS, INITIAL_VEHICLES } from '@/db';
import { transmitOutboxBatch } from '@/services/syncService';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'ssoma' | 'fleet' | 'dashboard' | 'personnel'>('ssoma');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Data states from Dexie
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(INITIAL_VEHICLES);
  const [outboxEvents, setOutboxEvents] = useState<OutboxEvent[]>([]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ComplianceStatus>('all');
  const [selectedCuadrilla, setSelectedCuadrilla] = useState('ALL');

  // Modals state
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    workerName: string;
    docType: string;
  }>({
    isOpen: false,
    workerName: '',
    docType: '',
  });

  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isGaritaSettingsOpen, setIsGaritaSettingsOpen] = useState(false);
  const [isLockPoliciesOpen, setIsLockPoliciesOpen] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isPlantConfigOpen, setIsPlantConfigOpen] = useState(false);
  const [isInspectorProfileOpen, setIsInspectorProfileOpen] = useState(false);
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] = useState(false);
  const [isFotocheckOpen, setIsFotocheckOpen] = useState(false);
  const [isGatePassAuditOpen, setIsGatePassAuditOpen] = useState(false);
  const [isWorkerDetailOpen, setIsWorkerDetailOpen] = useState(false);
  const [isShiftHandoverOpen, setIsShiftHandoverOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<WorkerProfile | null>(null);

  // Top header dropdown menu
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    icon: 'check_circle',
  });

  const showToast = useCallback((message: string, icon: string = 'check_circle') => {
    setToast({ show: true, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  }, []);

  // Load data from Dexie DB
  const refreshData = useCallback(async () => {
    try {
      await initializeDatabase();
      const allWorkers = await db.workers.toArray();
      const allVehicles = await db.vehicles.toArray();
      const allOutbox = await db.outbox_events.filter((e) => !e.synced).toArray();

      if (allWorkers.length > 0) setWorkers(allWorkers);
      if (allVehicles.length > 0) setVehicles(allVehicles);
      setOutboxEvents(allOutbox);
    } catch (err) {
      console.error('Error loading Dexie database:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Online / Offline listener
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Conexión de red restablecida. Servidor accesible.', 'cloud_done');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Modo sin conexión activado. Guardando eventos en IndexedDB.', 'cloud_off');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global shortcut Ctrl+K / Cmd+K para Paleta de Comandos Táctica
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [refreshData, showToast]);

  // SSOMA Filtering logic
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesStatus =
        selectedStatus === 'all' || worker.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        worker.fullName.toLowerCase().includes(q) ||
        worker.dni.includes(q) ||
        worker.role.toLowerCase().includes(q) ||
        worker.cuadrilla.toLowerCase().includes(q);
      const matchesCuadrilla =
        selectedCuadrilla === 'ALL' || worker.cuadrilla === selectedCuadrilla;

      return matchesStatus && matchesSearch && matchesCuadrilla;
    });
  }, [workers, selectedStatus, searchQuery, selectedCuadrilla]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      total: workers.length,
      aptos: workers.filter((w) => w.status === 'apto').length,
      porVencer: workers.filter((w) => w.status === 'por_vencer').length,
      bloqueados: workers.filter((w) => w.status === 'bloqueado').length,
    };
  }, [workers]);

  // Handlers estables con useCallback para prevenir re-renders de componentes memoizados
  const handleToggleBlock = useCallback(async (workerId: string, currentStatus: string) => {
    const newStatus: ComplianceStatus = currentStatus === 'bloqueado' ? 'apto' : 'bloqueado';
    const newLabel = newStatus === 'bloqueado' ? 'ACCESO BLOQUEADO (GARITA)' : 'APTO PARA INGRESO';

    await db.workers.update(workerId, {
      status: newStatus,
      statusLabel: newLabel,
      biometricVerified: newStatus === 'apto',
    });

    // Add Outbox event
    const idempotencyKey = crypto.randomUUID();
    await db.outbox_events.add({
      id: `evt-${Date.now()}`,
      idempotencyKey,
      eventType: 'WORKER_STATUS_OVERRIDE',
      payload: { workerId, newStatus, timestamp: new Date().toISOString() },
      createdAtUtc: new Date().toISOString(),
      synced: false,
      retryCount: 0,
    });

    await refreshData();
    if (newStatus === 'bloqueado') {
      audio.playWarningAlarm();
      haptic.vibrateWarning();
    } else {
      audio.playTurnstileRelease();
      haptic.vibrateSuccess();
    }
    showToast(
      newStatus === 'bloqueado'
        ? 'Trabajador bloqueado preventivamente en garita'
        : 'Bloqueo levantado exitosamente',
      newStatus === 'bloqueado' ? 'lock' : 'lock_open'
    );
  }, [refreshData, showToast]);

  const handleDocumentSubmit = useCallback(async (
    workerName: string,
    docType: string,
    fileName: string
  ) => {
    setUploadModalState({ isOpen: false, workerName: '', docType: '' });

    const allWorkers = await db.workers.toArray();
    const targetWorker = allWorkers.find((w) => w.fullName === workerName);
    if (targetWorker) {
      const updatedCreds = targetWorker.credentials.map((c) => {
        if (docType.includes(c.name) || c.name.includes(docType)) {
          return {
            ...c,
            status: 'conforme' as const,
            statusText: '100% AUDITADO',
            expiryDate: '2026-04-30',
          };
        }
        return c;
      });

      const hasRemainingExpired = updatedCreds.some((c) => c.status === 'vencido');
      const hasRemainingWarning = updatedCreds.some((c) => c.status === 'por_vencer');
      const newStatus: ComplianceStatus = hasRemainingExpired
        ? 'bloqueado'
        : hasRemainingWarning
        ? 'por_vencer'
        : 'apto';

      const newLabel =
        newStatus === 'apto'
          ? 'APTO PARA INGRESO'
          : newStatus === 'por_vencer'
          ? 'POR VENCER (≤15 DÍAS)'
          : 'ACCESO BLOQUEADO';

      await db.workers.update(targetWorker.id, {
        status: newStatus,
        statusLabel: newLabel,
        biometricVerified: newStatus === 'apto',
        credentials: updatedCreds,
      });

      // Queue Outbox Event
      const idempotencyKey = crypto.randomUUID();
      await db.outbox_events.add({
        id: `evt-${Date.now()}`,
        idempotencyKey,
        eventType: 'DOCUMENT_UPLOAD',
        payload: {
          workerId: targetWorker.id,
          docType,
          fileName,
          timestamp: new Date().toISOString(),
        },
        createdAtUtc: new Date().toISOString(),
        synced: false,
        retryCount: 0,
      });

      await refreshData();
      audio.playChime();
      haptic.vibrateSuccess();
    }

    showToast(
      `Documento "${docType}" firmado y registrado. Notificando a Garita Quellaveco...`,
      'cloud_done'
    );
  }, [refreshData, showToast]);

  const handleSyncNow = useCallback(async () => {
    audio.playBeep(650, 0.05);
    haptic.vibrateClick();
    const pendingEvents = await db.outbox_events.filter((e) => !e.synced).toArray();
    if (pendingEvents.length === 0) {
      audio.playChime();
      showToast('Sincronización batch completada: 0 eventos pendientes en cola local (al día)', 'cloud_done');
      return;
    }

    const result = await transmitOutboxBatch(pendingEvents);
    if (result.success) {
      for (const evt of pendingEvents) {
        await db.outbox_events.update(evt.id, { synced: true });
      }
      await refreshData();
      audio.playChime();
      haptic.vibrateSuccess();
      showToast(
        result.isOffline
          ? `Sincronización batch completada: ${pendingEvents.length} eventos preservados localmente (Modo Faena Desconectada)`
          : `Sincronización batch completada: ${result.processedCount} eventos transmitidos (${result.duplicatesIgnored} dup descartados)`,
        result.isOffline ? 'cloud_off' : 'sync'
      );
    } else {
      audio.playWarningAlarm();
      haptic.vibrateWarning();
      showToast(result.message, 'error');
    }
  }, [refreshData, showToast]);

  const handleDownloadDossier = useCallback(() => {
    setIsDossierModalOpen(false);
    audio.playChime();
    haptic.vibrateSuccess();
    showToast(
      'Dossier de Acreditación generado: TERRATECH_SSOMA_MATRIZ_2025.zip descargado',
      'download_done'
    );
  }, [showToast]);

  // Ejecución táctica de comandos desde la Paleta (Ctrl+K)
  const handleExecuteCommand = useCallback((cmdId: string) => {
    switch (cmdId) {
      case 'cmd-guardia':
        setIsShiftHandoverOpen(true);
        break;
      case 'cmd-sync':
        handleSyncNow();
        break;
      case 'cmd-dossier':
        setIsDossierModalOpen(true);
        break;
      case 'cmd-carga':
        setIsBulkUploadOpen(true);
        break;
      case 'cmd-garita':
        setIsGaritaSettingsOpen(true);
        break;
      case 'cmd-politicas':
        setIsLockPoliciesOpen(true);
        break;
      case 'cmd-auditoria':
        setIsAuditTrailOpen(true);
        break;
      case 'cmd-dark': {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('terratech-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('terratech-theme', 'dark');
        }
        showToast(isDark ? 'Modo Plano Técnico (Claro) activado' : 'Modo Consola de Despacho (Oscuro) activado', 'contrast');
        break;
      }
      case 'cmd-audio': {
        const muted = audio.toggleMute();
        showToast(muted ? 'Audio industrial silenciado' : 'Audio industrial reactivado', muted ? 'volume_off' : 'volume_up');
        break;
      }
      case 'cmd-tab-ssoma':
        setCurrentTab('ssoma');
        break;
      case 'cmd-tab-flota':
        setCurrentTab('fleet');
        break;
      case 'cmd-tab-personal':
        setCurrentTab('personnel');
        break;
      case 'cmd-tab-dash':
        setCurrentTab('dashboard');
        break;
      default:
        break;
    }
  }, [handleSyncNow, showToast]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const handleSelectTab = useCallback((tab: 'ssoma' | 'fleet' | 'dashboard' | 'personnel') => {
    setCurrentTab(tab);
  }, []);

  const handleNotificationClick = useCallback(() => {
    setIsNotificationsOpen((prev) => !prev);
  }, []);

  const handleOpenUpload = useCallback((workerName: string, docType: string) => {
    setUploadModalState({
      isOpen: true,
      workerName,
      docType,
    });
  }, []);

  const handleAuditPass = useCallback((workerName: string) => {
    const target = workers.find((w) => w.fullName === workerName) || workers[0];
    setSelectedWorkerForModal(target);
    setIsGatePassAuditOpen(true);
  }, [workers]);

  const handleOpenMedicalRecord = useCallback((worker: WorkerProfile) => {
    setSelectedWorkerForModal(worker);
    setIsMedicalRecordOpen(true);
  }, []);

  const handleOpenFotocheck = useCallback((worker: WorkerProfile) => {
    setSelectedWorkerForModal(worker);
    setIsFotocheckOpen(true);
  }, []);

  const handleOpenWorkerDetail = useCallback((worker: WorkerProfile) => {
    setSelectedWorkerForModal(worker);
    setIsWorkerDetailOpen(true);
  }, []);

  const handleOpenReports = useCallback(() => {
    setIsReportsOpen(true);
  }, []);

  const handleOpenPlantConfig = useCallback(() => {
    setIsPlantConfigOpen(true);
  }, []);

  const handleOpenInspectorProfile = useCallback(() => {
    setIsInspectorProfileOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-black transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={handleToggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={handleCloseMobileSidebar}
        onOpenReports={handleOpenReports}
        onOpenPlantConfig={handleOpenPlantConfig}
        onOpenInspectorProfile={handleOpenInspectorProfile}
      />

      {/* Main Container Wrapper: Optimizado con transition-[padding-left] 150ms ease-out */}
      <div
        className={`w-full flex flex-col min-h-screen transition-[padding-left] duration-150 ease-out will-change-[padding-left] ${
          isSidebarCollapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={handleOpenMobileSidebar}
          isCollapsed={isSidebarCollapsed}
          onSyncClick={handleSyncNow}
          onNotificationClick={handleNotificationClick}
          isOnline={isOnline}
          pendingSyncCount={outboxEvents.length}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isNotificationsOpen={isNotificationsOpen}
          onCloseNotifications={() => setIsNotificationsOpen(false)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onShowToast={showToast}
        />

        {/* Main Content View: Vercel Dark Canvas #000000 */}
        <div className="flex-1 flex flex-col pt-16 bg-white dark:bg-black">
          <main className="flex-1 w-full bg-white dark:bg-black border-t border-slate-200 dark:border-[#262626] px-3.5 sm:px-6 lg:px-8 pt-5 pb-16 sm:pb-20 flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-[1700px] mx-auto flex flex-col gap-6">
              {/* VIEW: EXECUTIVE DASHBOARD */}
              {currentTab === 'dashboard' && (
                <ExecutiveDashboard
                  workers={workers}
                  vehicles={vehicles}
                  outboxEvents={outboxEvents}
                  onNavigateTab={setCurrentTab}
                  onSyncNow={handleSyncNow}
                  onOpenHandover={() => setIsShiftHandoverOpen(true)}
                />
              )}

              {/* VIEW: SSOMA ACREDITACIONES (MÓDULO 1) */}
              {currentTab === 'ssoma' && (
                <div className="flex flex-col w-full gap-5 sm:gap-6">
                  {/* Top View Header & Actions */}
                  <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <h1 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Control de Acreditaciones SSOMA
                        </h1>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-[#888888]">
                        Supervisión y Control de Acceso — Constructora Andina S.A.C. • U.M. Quellaveco
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 relative">
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#888888] font-sans">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Garita Enlazada 100%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 relative font-sans">
                        {/* Vercel Primary Button */}
                        <button
                          className="h-8 px-3 rounded-md bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-[#EAEAEA] text-xs font-medium tracking-tight flex items-center gap-1.5 transition-colors shadow-none border-0"
                          onClick={() => setIsDossierModalOpen(true)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px]">description</span>
                          <span>Exportar Dossier</span>
                        </button>

                        {/* 3-Dots Dropdown Config */}
                        <div className="relative">
                          <button
                            aria-label="Opciones avanzadas"
                            className="h-8 w-8 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] text-slate-500 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                            onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>

                          {isMainMenuOpen && (
                            <div className="absolute right-0 mt-1.5 w-64 rounded-md bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] shadow-xl py-1 z-50 flex flex-col font-sans text-xs">
                              <div className="px-3.5 py-1.5 text-[10px] text-slate-400 dark:text-[#666666] uppercase tracking-wider font-semibold font-sans">
                                Ajustes de Plataforma
                              </div>
                              <button
                                className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2.5 transition-colors font-sans"
                                onClick={() => {
                                  setIsMainMenuOpen(false);
                                  setIsBulkUploadOpen(true);
                                }}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px] text-slate-400 dark:text-[#888888]">
                                  upload_file
                                </span>
                                Carga Masiva de Acreditaciones
                              </button>
                              <button
                                className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2.5 transition-colors font-sans"
                                onClick={() => {
                                  setIsMainMenuOpen(false);
                                  setIsGaritaSettingsOpen(true);
                                }}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px] text-slate-400 dark:text-[#888888]">
                                  sensors
                                </span>
                                Ajustes de Garita y Torniquetes
                              </button>
                              <button
                                className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2.5 transition-colors font-sans"
                                onClick={() => {
                                  setIsMainMenuOpen(false);
                                  setIsLockPoliciesOpen(true);
                                }}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px] text-slate-400 dark:text-[#888888]">
                                  lock_clock
                                </span>
                                Políticas de Bloqueo
                              </button>
                              <div className="my-1 border-t border-slate-100 dark:border-[#1F1F1F]"></div>
                              <button
                                className="px-3.5 py-2 text-left text-xs text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2.5 transition-colors font-sans"
                                onClick={() => {
                                  setIsMainMenuOpen(false);
                                  setIsAuditTrailOpen(true);
                                }}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px] text-emerald-500">
                                  history
                                </span>
                                Registro de Auditoría
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* KPI Summary Strip */}
                  <KpiStats
                    total={counts.total}
                    aptos={counts.aptos}
                    porVencer={counts.porVencer}
                    bloqueados={counts.bloqueados}
                  />

                  {/* Filter Toolbar */}
                  <FilterToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedCuadrilla={selectedCuadrilla}
                    onCuadrillaChange={setSelectedCuadrilla}
                    counts={counts}
                  />

                  {/* Worker Cards Roster */}
                  <div className="flex flex-col gap-3">
                    {filteredWorkers.length === 0 ? (
                      <div className="p-8 rounded-md bg-white dark:bg-foundry-panel border border-slate-200 dark:border-foundry-border text-center text-sm font-mono text-slate-500 dark:text-foundry-aluminum flex flex-col items-center justify-center gap-2 shadow-hardware">
                        <span className="material-symbols-outlined text-slate-400 dark:text-foundry-muted text-[32px]">
                          person_search
                        </span>
                        No se encontraron colaboradores con los criterios seleccionados.
                      </div>
                    ) : (
                      filteredWorkers.map((worker) => (
                        <WorkerCard
                          key={worker.id}
                          worker={worker}
                          onOpenUpload={handleOpenUpload}
                          onAuditPass={handleAuditPass}
                          onToggleBlock={handleToggleBlock}
                          onShowToast={showToast}
                          onOpenMedicalRecord={handleOpenMedicalRecord}
                          onOpenFotocheck={handleOpenFotocheck}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* VIEW: FLOTA & CHECKLISTS PRE-USO (MÓDULO 2) */}
              {currentTab === 'fleet' && (
                <FleetModule
                  vehicles={vehicles}
                  onInspectionSubmitted={refreshData}
                  onShowToast={showToast}
                />
              )}

              {/* VIEW: DIRECTORIO DE PERSONAL */}
              {currentTab === 'personnel' && (
                <PersonnelDirectory
                  workers={workers}
                  onShowToast={showToast}
                  onOpenWorkerDetail={handleOpenWorkerDetail}
                />
              )}

              {/* Discrete Footer / Protocol Bar */}
              <footer className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span className="text-center sm:text-left">
                    Base de datos sincronizada: Garita Quellaveco 4,200m • Registro D.S. 024-2016-EM
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Modo Offline-First con Dexie.js (IndexedDB)</span>
                  <span>•</span>
                  <span className="font-mono text-amber-700 font-semibold">
                    TERRATECH INDUSTRIAL OS
                  </span>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <DossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        onDownload={handleDownloadDossier}
      />

      <UploadDocModal
        isOpen={uploadModalState.isOpen}
        workerName={uploadModalState.workerName}
        docType={uploadModalState.docType}
        onClose={() =>
          setUploadModalState({ isOpen: false, workerName: '', docType: '' })
        }
        onSubmit={handleDocumentSubmit}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onProcessBatch={(count) => {
          showToast(`Lote procesado: ${count} acreditaciones sincronizadas con Garita Quellaveco`, 'cloud_done');
          refreshData();
        }}
        onShowToast={showToast}
      />

      <GaritaSettingsModal
        isOpen={isGaritaSettingsOpen}
        onClose={() => setIsGaritaSettingsOpen(false)}
        onShowToast={showToast}
      />

      <LockPoliciesModal
        isOpen={isLockPoliciesOpen}
        onClose={() => setIsLockPoliciesOpen(false)}
        onShowToast={showToast}
      />

      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
        onShowToast={showToast}
      />


      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        onShowToast={showToast}
      />

      <PlantConfigModal
        isOpen={isPlantConfigOpen}
        onClose={() => setIsPlantConfigOpen(false)}
        onShowToast={showToast}
      />

      <InspectorProfileModal
        isOpen={isInspectorProfileOpen}
        onClose={() => setIsInspectorProfileOpen(false)}
        onShowToast={showToast}
      />

      <MedicalRecordModal
        isOpen={isMedicalRecordOpen}
        worker={selectedWorkerForModal}
        onClose={() => setIsMedicalRecordOpen(false)}
        onShowToast={showToast}
      />

      <FotocheckModal
        isOpen={isFotocheckOpen}
        worker={selectedWorkerForModal}
        onClose={() => setIsFotocheckOpen(false)}
        onShowToast={showToast}
      />

      <GatePassAuditModal
        isOpen={isGatePassAuditOpen}
        worker={selectedWorkerForModal}
        onClose={() => setIsGatePassAuditOpen(false)}
        onConfirmEntry={(name) => {
          showToast(`Pase de mina validado para ${name}`, 'verified_user');
        }}
        onShowToast={showToast}
      />

      <WorkerDetailModal
        isOpen={isWorkerDetailOpen}
        worker={selectedWorkerForModal}
        onClose={() => setIsWorkerDetailOpen(false)}
        onOpenFotocheck={handleOpenFotocheck}
        onOpenMedicalRecord={handleOpenMedicalRecord}
        onShowToast={showToast}
      />

      {/* Paleta de Comandos Táctica (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        workers={workers}
        vehicles={vehicles}
        onSelectWorker={(worker) => {
          setSelectedWorkerForModal(worker);
          setIsWorkerDetailOpen(true);
        }}
        onSelectVehicle={(vehicle) => {
          setCurrentTab('fleet');
          showToast(`Vehículo seleccionado: ${vehicle.plate} (${vehicle.code})`, 'fire_truck');
        }}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* Live Ticker de Caja Negra (Blackbox Telemetry Dock) */}
      <BlackboxTicker isCollapsed={isSidebarCollapsed} />

      {/* Libro de Guardia Digital (Acta de Handover 14x7 / 7x7) */}
      <ShiftHandoverModal
        isOpen={isShiftHandoverOpen}
        onClose={() => setIsShiftHandoverOpen(false)}
        workers={workers}
        vehicles={vehicles}
        onHandoverSigned={(acta) => {
          showToast(`Acta de Guardia firmada: Turno ${acta.shift} sellada con hash SHA-256`, 'assignment_turned_in');
          refreshData();
        }}
        onShowToast={showToast}
      />

      {/* Toast System */}
      <Toast toast={toast} />
    </div>
  );
}
