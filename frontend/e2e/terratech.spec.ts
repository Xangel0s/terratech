import { test, expect } from '@playwright/test';

test.describe('Terratech Industrial OS - E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to hydrate and Dexie DB to initialize
    await expect(page.locator('h1')).toContainText('Control de Acreditaciones SSOMA');
  });

  test('01. Debería cargar la interfaz con branding, top navbar y avatares fotográficos reales', async ({ page }) => {
    // Verificar logotipo e isotipo Terratech
    await expect(page.locator('text=TERRATECH').first()).toBeVisible();
    await expect(page.locator('text=OS INDUSTRIAL v2.4').first()).toBeVisible();

    // Verificar avatar de Ing. Sarah Jenkins en el sidebar
    const sarahAvatar = page.locator('img[alt="Ing. Sarah Jenkins"]');
    await expect(sarahAvatar).toBeVisible();

    // Verificar avatares fotográficos de trabajadores en las tarjetas
    const mariaAvatar = page.locator('img[alt="Ing. María Elena Tapia"]');
    await expect(mariaAvatar).toBeVisible();

    // Verificar KPIs numéricos
    await expect(page.locator('text=Personal Evaluado')).toBeVisible();
    await expect(page.locator('text=Aptos Ingreso')).toBeVisible();
    await expect(page.locator('text=Por Vencer (≤15d)')).toBeVisible();
    await expect(page.locator('text=Restringidos')).toBeVisible();
  });

  test('02. Debería filtrar trabajadores por semáforo (Todos, Aptos, Por Vencer, Bloqueados)', async ({ page }) => {
    // Filtrar por 'Por Vencer'
    await page.click('button:has-text("Por Vencer")');
    await expect(page.locator('text=Javier Paredes Silva')).toBeVisible();
    await expect(page.locator('text=Ing. María Elena Tapia')).not.toBeVisible();

    // Filtrar por 'Bloqueados'
    await page.click('button:has-text("Bloqueados")');
    await expect(page.locator('text=Roberto Arteaga Ramos')).toBeVisible();
    await expect(page.locator('text=Javier Paredes Silva')).not.toBeVisible();

    // Volver a 'Todos'
    await page.click('button:has-text("Todos")');
    await expect(page.locator('text=Ing. María Elena Tapia')).toBeVisible();
    await expect(page.locator('text=Roberto Arteaga Ramos')).toBeVisible();
  });

  test('03. Debería buscar trabajadores en tiempo real por DNI y filtrar por cuadrilla', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar por colaborador"]');
    
    // Búsqueda por DNI
    await searchInput.fill('44892105');
    await expect(page.locator('text=Ing. María Elena Tapia')).toBeVisible();
    await expect(page.locator('text=Roberto Arteaga Ramos')).not.toBeVisible();

    // Limpiar búsqueda
    await searchInput.fill('');
    await expect(page.locator('text=Roberto Arteaga Ramos')).toBeVisible();

    // Filtro por cuadrilla
    await page.selectOption('select', 'Mantenimiento de Planta');
    await expect(page.locator('text=Javier Paredes Silva')).toBeVisible();
    await expect(page.locator('text=Roberto Arteaga Ramos')).not.toBeVisible();

    // Restablecer
    await page.selectOption('select', 'ALL');
    await expect(page.locator('text=Roberto Arteaga Ramos')).toBeVisible();
  });

  test('04. Debería expandir el Expediente ZIP técnico con detalles médicos y de endoso SCTR', async ({ page }) => {
    // Click en botón Expediente ZIP del primer trabajador
    const expedienteBtn = page.locator('button:has-text("Expediente ZIP")').first();
    await expedienteBtn.click();

    // Verificar acordeón desplegado
    await expect(page.locator('text=Clínica San José de Moquegua')).toBeVisible();
    await expect(page.locator('text=Endosada a favor de Anglo American Quellaveco S.A.').first()).toBeVisible();
    await expect(page.locator('text=Licencia Interna M-04')).toBeVisible();

    // Volver a colapsar
    await expedienteBtn.click();
    await expect(page.locator('text=Clínica San José de Moquegua')).not.toBeVisible();
  });

  test('05. Debería abrir y ejecutar el compilador del Dossier ZIP + Excel', async ({ page }) => {
    await page.click('button:has-text("Exportar Dossier")');
    
    // Verificar modal abierto
    await expect(page.locator('text=COMPILADOR DE DOSSIER ZIP + EXCEL')).toBeVisible();
    await expect(page.locator('text=TERRATECH_SSOMA_MATRIZ_2025.zip')).toBeVisible();
    await expect(page.locator('text=SHA256 VALID')).toBeVisible();

    // Confirmar descarga
    await page.click('button:has-text("DESCARGAR ARCHIVO (.ZIP)")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Dossier de Acreditación generado');
  });

  test('06. Debería permitir la carga documental en el modal con firma digital SHA-256', async ({ page }) => {
    // Click en "Renovar SCTR" o "Subir Anexo 7C"
    const actionBtn = page.locator('button:has-text("Renovar SCTR"), button:has-text("Subir Anexo 7C")').first();
    await actionBtn.click();

    // Verificar modal de carga documental
    await expect(page.locator('text=GESTIÓN DOCUMENTAL SSOMA')).toBeVisible();

    // Click en zona de carga para simular archivo
    await page.click('text=Haga clic para seleccionar archivo');
    await expect(page.locator('text=listo para firma criptográfica SHA-256')).toBeVisible();

    // Confirmar actualización
    await page.click('button:has-text("CONFIRMAR ACTUALIZACIÓN")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('firmado y registrado');
  });

  test('07. Debería navegar al Módulo de Flota y ejecutar Checklist Pre-Uso con bloqueo por falla crítica', async ({ page }) => {
    // Navegar a Flota en el sidebar
    await page.click('button[title*="Flota & Checklists"]');
    await expect(page.locator('h2')).toContainText('Módulo de Flota & Checklists Pre-Uso');

    // Verificar flota visible
    await expect(page.locator('text=CAM-042').first()).toBeVisible();
    await expect(page.locator('text=VOL-108').first()).toBeVisible();

    // Abrir Checklist para el primer vehículo en la grilla
    await page.locator('.grid button:has-text("Checklist")').first().click();
    await expect(page.locator('text=INSPECCIÓN PRE-USO')).toBeVisible();

    // Marcar el primer ítem crítico (Frenos) como No Conforme (NC)
    const ncButtons = page.locator('button[title="No Conforme"]');
    await ncButtons.first().click();

    // Verificar alerta inmediata de peligro crítico
    await expect(page.locator('text=BLOQUEO PREVENTIVO AUTOMÁTICO')).toBeVisible();
    await expect(page.locator('button:has-text("REGISTRAR BLOQUEO CRÍTICO")')).toBeVisible();

    // Tomar foto simulada
    await page.click('text=Tomar foto con cámara del dispositivo móvil');
    await expect(page.locator('text=Foto de odómetro y frente de máquina capturada')).toBeVisible();

    // Confirmar bloqueo
    await page.click('button:has-text("REGISTRAR BLOQUEO CRÍTICO")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('ALERTA PELIGRO CRÍTICO');
  });

  test('08. Debería navegar al Dashboard Ejecutivo y verificar sincronización offline Outbox', async ({ page }) => {
    // Navegar a Dashboard
    await page.click('button[title*="Dashboard General"]');
    await expect(page.locator('h2')).toContainText('Panel Ejecutivo Terratech Industrial OS');

    // Verificar métricas del dashboard
    await expect(page.locator('text=Índice de Acreditación')).toBeVisible();
    await expect(page.locator('text=Disponibilidad de Flota')).toBeVisible();
    await expect(page.locator('text=Motor de Sincronización Offline')).toBeVisible();

    // Click en sincronizar cola
    await page.click('button:has-text("Forzar Batch POST /api/v1/sync")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Sincronización batch completada');
  });

  test('09. Debería visualizar el Directorio Maestro de Personal con fotografías', async ({ page }) => {
    // Navegar a Directorio Personal
    await page.click('button[title*="Directorio de Personal"]');
    await expect(page.locator('h2')).toContainText('Directorio Maestro de Personal');

    // Verificar que los colaboradores tengan sus avatares
    const avatars = page.locator('img[alt="Ing. María Elena Tapia"], img[alt="Javier Paredes Silva"]');
    await expect(avatars.first()).toBeVisible();

    // Buscar en el directorio
    const dirSearch = page.locator('input[placeholder*="Buscar por DNI, nombre o cuadrilla"]');
    await dirSearch.fill('Geotécnica');
    await expect(page.locator('text=Ing. María Elena Tapia')).toBeVisible();
  });
});
