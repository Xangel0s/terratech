import { test, expect } from '@playwright/test';

test.describe('Terratech Industrial OS - Button & Modal Functionality Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Control de Acreditaciones SSOMA');
  });

  test('01. Auditoría: Carga Masiva de Acreditaciones', async ({ page }) => {
    // Abrir menú de plataforma 3-dots
    await page.click('button[aria-label="Opciones avanzadas"]');
    await page.click('button:has-text("Carga Masiva de Acreditaciones")');

    // Verificar modal abierto con datos de lote
    await expect(page.locator('text=CARGA MASIVA DE ACREDITACIONES SSOMA')).toBeVisible();
    await expect(page.locator('text=Registros Detectados')).toBeVisible();

    // Procesar lote
    await page.click('button:has-text("Validar y Acreditar Lote")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Lote procesado');
  });

  test('02. Auditoría: Ajustes de Garita y Torniquetes', async ({ page }) => {
    await page.click('button[aria-label="Opciones avanzadas"]');
    await page.click('button:has-text("Ajustes de Garita y Torniquetes")');

    await expect(page.locator('text=CONFIGURACIÓN DE GARITA & TORNIQUETES')).toBeVisible();
    await expect(page.locator('text=TORNIQUETE ALFA')).toBeVisible();

    await page.click('button:has-text("Guardar Configuración")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Parámetros de Garita y Torniquetes transmitidos');
  });

  test('03. Auditoría: Políticas de Bloqueo D.S. 024-2016-EM', async ({ page }) => {
    await page.click('button[aria-label="Opciones avanzadas"]');
    await page.click('button:has-text("Políticas de Bloqueo")');

    await expect(page.locator('text=POLÍTICAS Y REGLAS DE BLOQUEO PREVENTIVO')).toBeVisible();
    await expect(page.locator('text=Examen Médico Ocupacional (Anexo 7C Gran Altura)')).toBeVisible();

    await page.click('button:has-text("Aplicar Políticas de Bloqueo")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Reglas de Bloqueo D.S. 024-2016-EM sincronizadas');
  });

  test('04. Auditoría: Registro de Auditoría y Trazabilidad', async ({ page }) => {
    await page.click('button[aria-label="Opciones avanzadas"]');
    await page.click('button:has-text("Registro de Auditoría")');

    await expect(page.locator('text=REGISTRO DE AUDITORÍA SSOMA & TRAZABILIDAD SUNAFIL')).toBeVisible();
    await expect(page.locator('text=LEDGER INMUTABLE')).toBeVisible();

    await page.click('button:has-text("Exportar Bitácora Criptográfica (.CSV)")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Bitácora criptográfica');

    await page.click('button:has-text("Cerrar")');
    await expect(page.locator('text=REGISTRO DE AUDITORÍA SSOMA & TRAZABILIDAD SUNAFIL')).not.toBeVisible();
  });

  test('05. Auditoría: Centro de Notificaciones en Header', async ({ page }) => {
    await page.click('button[aria-label="Notificaciones"]');

    await expect(page.locator('text=CENTRO DE NOTIFICACIONES Y DESPACHO')).toBeVisible();
    await expect(page.locator('text=Parada Crítica: Volquete VOL-108 Bloqueado')).toBeVisible();

    await page.click('button:has-text("Marcar todas como leídas")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Todas las alertas marcadas como atendidas');

    await page.click('button:has-text("Cerrar")');
    await expect(page.locator('text=CENTRO DE NOTIFICACIONES Y DESPACHO')).not.toBeVisible();
  });

  test('06. Auditoría: Reportes & Datos en Sidebar', async ({ page }) => {
    await page.click('button[title="Reportes & Datos Oficiales"]');

    await expect(page.locator('text=CENTRO DE REPORTES & EXPORTACIÓN DE DATOS')).toBeVisible();
    await expect(page.locator('text=Matriz General de Acreditación y Pases de Garita')).toBeVisible();

    // Click en Descargar primer reporte
    await page.locator('.grid button:has-text("Descargar")').first().click();
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Generando reporte');

    await page.click('button:has-text("Cerrar")');
  });

  test('07. Auditoría: Configuración de Planta en Sidebar', async ({ page }) => {
    await page.click('button[title="Configuración de Planta Quellaveco"]');

    await expect(page.locator('text=PARÁMETROS DE PLANTA & UNIDAD MINERA')).toBeVisible();
    await expect(page.locator('text=U.M. Quellaveco • Anglo American')).toBeVisible();

    await page.click('button:has-text("Guardar Parámetros de Planta")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Parámetros de Planta Quellaveco actualizados');
  });

  test('08. Auditoría: Perfil del Inspector (Sarah Jenkins)', async ({ page }) => {
    await page.click('button[title="Ver Credencial de Ing. Sarah Jenkins"]');

    await expect(page.locator('text=PERFIL DEL AUDITOR SSOMA EN GUARDIA')).toBeVisible();
    await expect(page.locator('text=CIP #184209 • CONSTRUCTORA ANDINA')).toBeVisible();

    await page.click('button:has-text("Verificar Token PKI")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Token Criptográfico PKI');

    await page.click('button:has-text("Cerrar")');
  });

  test('09. Auditoría: Ficha Médica Anexo 7C en WorkerCard', async ({ page }) => {
    // Abrir 3-dots del primer trabajador
    await page.locator('.worker-card button[aria-label="Opciones de trabajador"]').first().click();
    await page.click('button:has-text("Ver Ficha Médica (Anexo 7C)")');

    await expect(page.locator('text=FICHA MÉDICA OCUPACIONAL • ANEXO 7C')).toBeVisible();
    await expect(page.locator('text=Evaluación Médica de Gran Altura Geográfica')).toBeVisible();
    await expect(page.locator('text=SatO2: 94% (Óptimo)')).toBeVisible();

    await page.click('button:has-text("Descargar PDF Oficial")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Certificado EMO_ANEXO_7C');

    await page.click('button:has-text("Cerrar")');
  });

  test('10. Auditoría: Fotocheck Industrial en WorkerCard', async ({ page }) => {
    await page.locator('.worker-card button[aria-label="Opciones de trabajador"]').first().click();
    await page.click('button:has-text("Imprimir Fotocheck")');

    await expect(page.locator('text=FOTOCHECK INDUSTRIAL DE ACCESO')).toBeVisible();
    await expect(page.locator('text=Credencial PVC CR-80')).toBeVisible();

    // Cambiar a reverso
    await page.click('button:has-text("Reverso (Dorso / SCTR)")');
    await expect(page.locator('text=RIMAC SEGUROS')).toBeVisible();

    // Descargar
    await page.click('button:has-text("Descargar")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Fotocheck digital');

    await page.click('button:has-text("Cerrar")');
  });

  test('11. Auditoría: Auditar Pase en Vivo en WorkerCard', async ({ page }) => {
    // Click en botón Auditar Pase del primer trabajador apto
    await page.locator('button:has-text("Auditar Pase")').first().click();

    await expect(page.locator('text=AUDITORÍA DE PASE EN GARITA EN VIVO')).toBeVisible();
    await expect(page.locator('text=SOLENOIDE TORNIQUETE LIBERADO')).toBeVisible();

    await page.click('button:has-text("Registrar Ingreso en Bitácora")');
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast')).toContainText('Pase de garita validado y registrado');
  });

  test('12. Auditoría: Ver Ficha de Personal en Directorio', async ({ page }) => {
    await page.click('button[title*="Directorio de Personal"]');
    await expect(page.locator('h2')).toContainText('Directorio Maestro de Personal');

    // Click en primer botón de Ver Ficha de Personal
    await page.locator('button:has-text("Ver Ficha de Personal")').first().click();

    await expect(page.locator('text=FICHA INTEGRAL DEL COLABORADOR')).toBeVisible();
    await expect(page.locator('text=Expediente de Personal • Contrato Quellaveco')).toBeVisible();

    // Navegar pestañas
    await page.click('button:has-text("Matriz Documentaria")');
    await expect(page.locator('text=Vigencia:').first()).toBeVisible();

    await page.click('button:has-text("Legal & Endoso")');
    await expect(page.locator('text=Endoso a favor de Anglo American:')).toBeVisible();

    await page.click('button:has-text("Cerrar")');
    await expect(page.locator('text=FICHA INTEGRAL DEL COLABORADOR')).not.toBeVisible();
  });
});
