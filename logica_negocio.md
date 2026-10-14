# Lógica de Negocio y Módulos del Sistema: Terratech

Terratech está concebido para operar en entornos de alta exigencia (minería, construcción e industrias pesadas). Para lograr un sistema escalable y permitir la comercialización de módulos adicionales sin refactorizar el código base, la arquitectura funcional se divide estrictamente entre el **Núcleo (Core Engine)**, los **Módulos Base del MVP** y los **Módulos de Expansión (Upselling)**.

---

## 1. El Núcleo Obligatorio (Core Engine)

El Core Engine constituye la columna vertebral del sistema. Ningún módulo funciona sin él, pero no se comercializa como un módulo independiente, sino como el motor fundamental de la plataforma:

* **Gestión de Empresas y Sedes (Multi-tenant):**
  * Aislamiento estricto de datos por empresa contratista y unidad minera.
  * Permite operar múltiples clientes y contratas en la misma infraestructura de forma segura.
* **Directorio Central de Personal y Activos:**
  * Fichas maestras de trabajadores: DNI, nombres, cargo, régimen de trabajo, cuadrilla y estado laboral.
  * Fichas maestras de equipos/activos: placa de vehículo o código interno de máquina, marca, modelo, tipología y responsable asignado.
* **Control de Accesos Basado en Roles (RBAC):**
  * **Superintendente / Gerente:** Dashboards ejecutivos, métricas consolidadas de cumplimiento y reportes para auditoría minera.
  * **Supervisor SSOMA / Ingeniero Residente:** Aprobación, validación y carga masiva de documentación, levantamiento de observaciones y liberación de pases.
  * **Técnico / Conductor / Operador:** Vista móvil simplificada para llenado de checklists pre-uso, reporte rápido de eventos y visualización de su estatus de acreditación.
* **Motor de Sincronización Offline (Outbox Pattern):**
  * Cola local de eventos en el dispositivo móvil con reconciliación e idempotencia garantizada al restablecer conexión.

---

## 2. Módulos Base del MVP (Alcance Inicial)

Los módulos base resuelven los dos dolores operativos más costosos y críticos en garita y faena:

```
              ┌─────────────────────────────────────────────────────────┐
              │                   MÓDULOS BASE (MVP)                    │
              └──────────────┬───────────────────────────┬──────────────┘
                             │                           │
              ┌──────────────▼────────────┐ ┌────────────▼──────────────┐
              │       MÓDULO SSOMA        │ │       MÓDULO FLOTA        │
              │  Semáforo Acreditaciones  │ │   Checklists Pre-Uso      │
              │   y Pases de Mina         │ │   Equipos y Maquinaria    │
              └───────────────────────────┘ └───────────────────────────┘
```

### Módulo 1: Semáforo de Acreditaciones y Pases de Mina (SSOMA / RRHH)

* **Objetivo:** Garantizar que ningún colaborador sea movilizado a garita de control de la unidad minera sin cumplir el 100% de los requisitos documentarios vigentes, eliminando multas, demoras y "bajadas" imprevistas.
* **Lógica del Semáforo de Cumplimiento:**
  * 🟢 **Apto:** Toda la documentación requerida está cargada y vigente con un margen superior a 15 días.
  * 🟡 **Por Vencer:** Al menos un documento crítico vence en menos de 15 días (disparo de alerta preventiva para renovación anticipada).
  * 🔴 **Bloqueado:** Al menos un documento está vencido o no aprobado (bloqueo automático del pase de mina).
* **Documentación Controlada:**
  * **Examen Médico Ocupacional (EMO):** Fecha de vencimiento, vigencia anual y registro de restricciones médicas operativas.
  * **Póliza SCTR (Salud y Pensión):** Control de renovación mensual y constancia de cobertura vigente.
  * **Inducción General de Seguridad:** Certificación obligatoria (Anexo 4 o Anexo 5 según la unidad minera).
  * **Certificaciones Especializadas:** Licencia interna de manejo, trabajos en altura, trabajos en caliente, espacios confinados, etc.
* **Exportador del "Dossier de Acreditación":**
  * Generación en un clic de un archivo ZIP estructurado con los PDFs ordenados cronológicamente por trabajador.
  * Matriz consolidada en Excel respetando el formato y orden exigido por la empresa contratista y la titular minera.

---

### Módulo 2: Checklists Pre-Uso de Flota y Maquinaria (Operaciones / Mantenimiento)

* **Objetivo:** Digitalizar y reemplazar los talonarios físicos en papel carbón en camionetas 4x4, volquetes y maquinaria amarilla, asegurando trazabilidad y estado mecánico en tiempo real.
* **Funcionalidades Clave:**
  * **Formularios Dinámicos Configurados por Activo:**
    * Camioneta 4x4 (luces, extintor, circulina, pértiga, tracción, neumáticos).
    * Excavadora / Línea Amarilla (mandos hidráulicos, orugas, fugas de fluido, cabina ROPS/FOPS).
    * Compresores y Luminarias portátiles (horómetro, niveles de aceite, sistemas de parada de emergencia).
  * **Evaluación Rápida por Ítem:**
    * `Conforme` (C)
    * `No Conforme` (NC)
    * `No Aplica` (NA)
  * **Lógica de Bloqueo por Falla Crítica:**
    * Si falla un ítem catalogado como crítico (ej. frenos, dirección, dirección hidráulica, fuga severa de aceite, cinturón de seguridad), el sistema bloquea inmediatamente el uso del activo en la app.
    * Notificación de alerta inmediata clasificada como **"Peligro Crítico"** dirigida al jefe de taller y supervisor de operaciones.
  * **Evidencia y Firma Digital en Campo:**
    * Captura fotográfica obligatoria de no conformidades con almacenamiento local en Base64/Blob.
    * Firma digital táctil del operador en pantalla, estampando fecha, hora UTC y geolocalización.

---

## 3. Módulos de Expansión (Upselling / Fase 2)

Arquitectura preparada para comercializar y activar extensiones sin modificar el núcleo del sistema:

| Módulo Adicional | Problema que Resuelve | Complejidad Técnica |
| :--- | :--- | :---: |
| **Tareo y Regímenes Atípicos (14x7, 21x7)** | Control estricto de días trabajados, bajadas a ciudad, descansos médicos y cálculo de sobretiempos en operaciones remotas. | **Media** |
| **Control de EPP y Stock de Seguridad** | Trazabilidad de entrega de zapatos de seguridad, respiradores, filtros y arneses con firma digital para auditorías laborales (SUNAFIL). | **Baja** |
| **Reportes Flash de Incidentes SSOMA** | Notificación inmediata de cuasi-accidentes, actos y condiciones subestándar desde campo con fotos y georreferenciación. | **Media** |
| **Integración con GPS / Telemetría** | Cruce de odómetros y horómetros reales transmitidos por telemetría vehicular para calendarizar mantenimientos preventivos automáticos. | **Alta** |

---

## 4. Reglas de Negocio Transversales

1. **Idempotencia Operativa:** Cualquier checklist o subida documental generada sin señal en campamento o socavón conserva un identificador universal único (UUIDv4) que evita duplicados durante la sincronización.
2. **Inmutabilidad de Auditoría:** Una vez firmado un checklist o emitido un pase de mina, los registros quedan congelados y sellados con historial de modificaciones almacenado en formato JSONB.
3. **Bloqueo Preventivo:** Los estados de semáforo 🔴 bloquean automáticamente la generación del Dossier de Acreditación para ese colaborador, impidiendo viajes no autorizados.
