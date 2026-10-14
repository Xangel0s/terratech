import { test, expect } from '@playwright/test';

test('Showcase Completo: Feel & Polish Industrial, Dark Console Mode y Rendimiento', async ({ page }) => {
  test.setTimeout(90000);
  // 1. Cargar la consola operativa
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Control de Acreditaciones SSOMA');
  await page.waitForTimeout(1000);

  // 2. Demostración de Micro-Elevación (Hover Lift) en las tarjetas de hardware
  const cards = page.locator('.worker-card');
  const firstCard = cards.first();
  await firstCard.hover();
  await page.waitForTimeout(800);

  const secondCard = cards.nth(1);
  await secondCard.hover();
  await page.waitForTimeout(800);

  // 3. Demostración de colapso rápido del Sidebar (150ms ease-out GPU promotion)
  const collapseBtn = page.locator('button[title*="Colapsar o expandir panel"]');
  await collapseBtn.click();
  await page.waitForTimeout(1200);

  // Expandir nuevamente el Sidebar
  await collapseBtn.click();
  await page.waitForTimeout(1000);

  // 4. Alternar a Modo Consola de Despacho (Dark Operations Mode)
  const consoleModeBtn = page.locator('button[aria-label="Alternar Modo Consola de Despacho"]');
  await consoleModeBtn.click();
  await page.waitForTimeout(1500);

  // Hover en modo oscuro sobre las tarjetas iluminadas
  await firstCard.hover();
  await page.waitForTimeout(800);

  // 5. Demostración del Compilador de Dossier dinámico con barra rayada y stream en vivo
  const exportBtn = page.locator('button:has-text("Exportar Dossier")');
  await exportBtn.click();
  await expect(page.locator('text=COMPILADOR DE DOSSIER ZIP + EXCEL')).toBeVisible();

  // Esperar a que la simulación de compresión avance con la barra rayada
  await page.waitForTimeout(2500);

  // Descargar con el botón iluminado de pulso verde
  const downloadBtn = page.locator('button:has-text("DESCARGAR ARCHIVO (.ZIP)")');
  await downloadBtn.click();
  await expect(page.locator('#toast')).toBeVisible();
  await page.waitForTimeout(1200);

  // 6. Volver a Modo Claro y navegar a Flota & Checklists
  await consoleModeBtn.click();
  await page.waitForTimeout(800);

  await page.click('button[title*="Flota & Checklists"]');
  await expect(page.locator('h2')).toContainText('Módulo de Flota & Checklists Pre-Uso');
  await page.waitForTimeout(1000);

  // 7. Abrir checklist del primer vehículo y marcar falla crítica
  await page.locator('.grid button:has-text("Checklist")').first().click();
  await expect(page.locator('text=INSPECCIÓN PRE-USO')).toBeVisible();
  await page.waitForTimeout(800);

  // Marcar No Conforme en frenos críticos
  await page.locator('button[title="No Conforme"]').first().click();
  await expect(page.locator('text=BLOQUEO PREVENTIVO AUTOMÁTICO')).toBeVisible();
  await page.waitForTimeout(800);

  // Capturar foto simulada
  await page.click('text=Tomar foto con cámara del dispositivo móvil');
  await page.waitForTimeout(800);

  // Registrar bloqueo
  await page.click('button:has-text("REGISTRAR BLOQUEO CRÍTICO")');
  await expect(page.locator('#toast')).toBeVisible();
  await page.waitForTimeout(1200);

  // 8. Navegar a Dashboard General y sincronizar Outbox
  await page.click('button[title*="Dashboard General"]');
  await expect(page.locator('h2')).toContainText('Panel Ejecutivo Terratech Industrial OS');
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Forzar Batch POST /api/v1/sync")');
  await expect(page.locator('#toast')).toBeVisible();
  await page.waitForTimeout(1500);
});
