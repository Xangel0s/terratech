import { test, expect } from '@playwright/test';

test.describe('TERRATECH Industrial OS - Tactical Console, Audio, Ctrl+K & Handover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('01. Ergonomía Sensorial: Alternar Audio Industrial en Header', async ({ page }) => {
    const audioBtn = page.locator('button[aria-label="Alternar Audio Industrial"]');
    await expect(audioBtn).toBeVisible();

    // Toggle mute
    await audioBtn.click();
    await expect(page.locator('button[aria-label="Alternar Audio Industrial"] span')).toContainText('volume_off');

    // Toggle unmute
    await audioBtn.click();
    await expect(page.locator('button[aria-label="Alternar Audio Industrial"] span')).toContainText('volume_up');
  });

  test('02. Paleta de Comandos Táctica: Abrir con Header y buscar por DNI', async ({ page }) => {
    // Abrir mediante botón "Comandos (Ctrl+K)" en Header
    const cmdBtn = page.locator('button[aria-label*="Paleta de Comandos"]');
    await expect(cmdBtn).toBeVisible();
    await cmdBtn.click();

    // Validar modal de la paleta
    const searchInput = page.locator('input[placeholder*="Escriba un comando"]');
    await expect(searchInput).toBeVisible();

    // Buscar por DNI de María Elena Tapia
    await searchInput.fill('44892105');
    const workerItem = page.locator('button:has-text("Ing. María Elena Tapia")');
    await expect(workerItem).toBeVisible();

    // Seleccionar resultado para abrir su expediente
    await workerItem.click();
    await expect(page.locator('text=FICHA INTEGRAL DEL COLABORADOR')).toBeVisible();

    // Cerrar modal
    await page.locator('button:has-text("Cerrar")').first().click();
  });

  test('03. Paleta de Comandos Táctica: Atajo de Teclado Ctrl+K y comando de guardia', async ({ page }) => {
    // Asegurar foco y disparar atajo de teclado Ctrl+K
    await page.locator('body').click();
    await page.keyboard.press('Control+k');

    const searchInput = page.locator('input[placeholder*="Escriba un comando"]');
    await expect(searchInput).toBeVisible();

    // Filtrar por acta de guardia
    await searchInput.fill('guardia');
    const cmdGuardia = page.locator('button:has-text("Generar Acta de Entrega de Guardia")');
    await expect(cmdGuardia).toBeVisible();

    // Ejecutar comando con click
    await cmdGuardia.click();

    // Validar que se abrió el Acta Digital de Relevo de Guardia
    await expect(page.locator('text=ACTA DIGITAL DE RELEVO DE GUARDIA')).toBeVisible();
    await page.locator('button:has-text("Cancelar")').click();
  });

  test('04. Live Ticker de Caja Negra: Expandir telemetría y filtrar eventos', async ({ page }) => {
    const ticker = page.locator('aside[aria-label="Caja Negra y Telemetría en Vivo"]');
    await expect(ticker).toBeVisible();
    await expect(ticker.locator('text=CAJA NEGRA TELEMETRÍA')).toBeVisible();

    // Expandir el dock de caja negra
    await ticker.locator('button:has-text("VER BITÁCORA")').click();
    await expect(page.locator('text=REGISTRO INMUTABLE DE EVENTOS CRIPTOGRÁFICOS')).toBeVisible();

    // Filtrar por eventos CRITICAL
    await page.locator('button:has-text("CRITICAL")').click();
    await expect(page.locator('text=TALLER-MEC-02')).toBeVisible();
    await expect(page.locator('text=PRE_USO_LOCKOUT')).toBeVisible();

    // Copiar hash
    await page.locator('button:has-text("COPIAR LOG")').click();
    await expect(page.locator('text=COPIADO')).toBeVisible();

    // Contraer
    await page.locator('button:has-text("MINIMIZAR")').click();
  });

  test('05. Libro de Guardia Digital: Doble firma táctica y sellado criptográfico', async ({ page }) => {
    // Navegar al Dashboard General desde el Sidebar
    await page.click('button[title*="Dashboard General"]');
    await expect(page.locator('text=Panel Ejecutivo Terratech Industrial OS')).toBeVisible();

    // Abrir Acta de Guardia
    const handoverBtn = page.locator('button:has-text("Acta de Guardia")');
    await expect(handoverBtn).toBeVisible();
    await handoverBtn.click();

    // Validar Acta Digital de Relevo de Guardia y métricas de guardia
    await expect(page.locator('text=ACTA DIGITAL DE RELEVO DE GUARDIA')).toBeVisible();
    await expect(page.locator('text=Personal Apto').first()).toBeVisible();

    // Simular firma digital del Supervisor Saliente en canvas 1
    const canvases = page.locator('canvas');
    await expect(canvases).toHaveCount(2);

    const canvasOutBox = await canvases.nth(0).boundingBox();
    if (canvasOutBox) {
      await page.mouse.move(canvasOutBox.x + 20, canvasOutBox.y + 20);
      await page.mouse.down();
      await page.mouse.move(canvasOutBox.x + 80, canvasOutBox.y + 40);
      await page.mouse.move(canvasOutBox.x + 140, canvasOutBox.y + 20);
      await page.mouse.up();
    }

    // Simular firma digital del Supervisor Entrante en canvas 2
    const canvasInBox = await canvases.nth(1).boundingBox();
    if (canvasInBox) {
      await page.mouse.move(canvasInBox.x + 20, canvasInBox.y + 20);
      await page.mouse.down();
      await page.mouse.move(canvasInBox.x + 80, canvasInBox.y + 40);
      await page.mouse.move(canvasInBox.x + 140, canvasInBox.y + 20);
      await page.mouse.up();
    }

    // Click para sellar y emitir acta
    const sealBtn = page.locator('button:has-text("Cerrar y Sellar Acta de Guardia")');
    await expect(sealBtn).toBeVisible();
    await sealBtn.click();

    // Validar toast de confirmación y cierre del modal
    await expect(page.locator('text=Acta de Relevo de Guardia sellada')).toBeVisible();
  });
});
