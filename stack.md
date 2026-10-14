# Plan de Tecnologías, Stack Técnico e Identidad Visual: Terratech

Terratech está diseñado para garantizar un consumo mínimo de servidor, tolerancia absoluta a la pérdida de conectividad a internet en campamentos mineros y seguridad institucional sin fisuras.

---

## 1. Arquitectura del Stack Técnico

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (PWA): React + Next.js + Tailwind CSS + Dexie.js (IndexedDB)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / TLS 1.3
┌──────────────────────────────────▼─────────────────────────────────────┐
│ REVERSE PROXY: Caddy (SSL automático, rate limiting, compresión Zstd) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Unix Socket / Puerto interno
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BACKEND: Go (Gin Framework)                                            │
│ ├─ Dominio: Clean Architecture (Handlers -> Services -> Repositories)  │
│ ├─ Seguridad: JWT (HttpOnly Cookies), Argon2id, Validación de esquemas │
│ └─ Sincronización: Outbox Processor con Idempotency Keys (UUIDv4)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Driver nativo pgx
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BASE DE DATOS: PostgreSQL                                              │
│ ├─ Tablas relacionales con Row-Level Security (RLS)                    │
│ ├─ Auditoría de eventos en columnas JSONB                              │
│ └─ Índices GiST / Trigram para búsquedas de DNI y nombres en miliseg.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Especificación por Capa Tecnológica

### Frontend (PWA Offline-First)
* **Framework:** React / Next.js para renderizado eficiente y soporte PWA integrado.
* **Estilos:** Tailwind CSS con tokens industriales personalizados.
* **Almacenamiento Local:** Dexie.js (IndexedDB) para gestión relacional y tipada en el cliente móvil.
* **Service Workers:** Estrategia *Cache-First* para assets estáticos y *Network-First* con *Fallback a Cache* para datos transaccionales.

### Reverse Proxy & Gateway
* **Caddy Server:**
  * Emisión y renovación automática de certificados SSL/TLS 1.3.
  * Rate limiting para mitigación de abusos.
  * Compresión Zstandard (Zstd) y Gzip para minimizar el ancho de banda satelital.

### Backend (Go + Gin)
* **Lenguaje:** Go (rendimiento nativo, consumo mínimo de memoria RAM y arranque instantáneo).
* **Framework Web:** Gin Framework por su alta velocidad de enrutamiento y bajo overhead.
* **Patrón de Arquitectura:** Clean Architecture modularizada por dominios (Handlers -> Services -> Repositories).
* **Seguridad:**
  * Hashing de contraseñas con **Argon2id** (estándar OWASP contra ataques por GPU).
  * Autenticación basada en **JWT** transmitido mediante cookies seguras (`HttpOnly`, `SameSite=Strict`, `Secure`).
  * Validación estricta de payloads y esquemas con validadores en Go.

### Base de Datos (PostgreSQL ACID)
* **Driver:** Conector nativo de alto rendimiento `pgx`.
* **Multi-tenancy:** Aislamiento a nivel de base de datos con **Row-Level Security (RLS)** por identificador de empresa contratista (`tenant_id`).
* **Auditoría:** Columnas `JSONB` para trazabilidad cronológica de cambios y snapshots de auditoría.
* **Optimización de Búsqueda:** Índices **GiST** y extensiones **pg_trgm** para búsquedas instantáneas por DNI, nombres de personal y placas en milisegundos.

---

## 3. Estrategia de Sincronización Offline (Cero Pérdida de Datos)

En faenas mineras y frentes de trabajo remotos, la conectividad es intermitente o nula durante turnos completos. La estrategia de sincronización se rige por tres pasos:

```
[Dispositivo Móvil]                                   [Servidor Go / DB]
┌──────────────────┐                                  ┌──────────────────┐
│ Acción de Usuario│                                  │                  │
│        │         │                                  │                  │
│ ┌──────▼───────┐ │                                  │                  │
│ │ Dexie.js     │ │                                  │                  │
│ │ (IndexedDB)  │ │                                  │                  │
│ │ + UUIDv4     │ │                                  │                  │
│ │ + UTC Time   │ │                                  │                  │
│ └──────┬───────┘ │                                  │                  │
│        │         │                                  │                  │
│ (Detecta Online) │                                  │                  │
│        ▼         │   POST /api/v1/sync (Batch JSON) │                  │
│ ┌──────────────┐ │ ───────────────────────────────> │ ┌──────────────┐ │
│ │Service Worker│ │                                  │ │Outbox Handler│ │
│ │Outbox Queue  │ │ <─────────────────────────────── │ │+ Transacción │ │
│ └──────────────┘ │         200 OK (Sync Acknowledged)│ │  PostgreSQL  │ │
└──────────────────┘                                  │ └──────────────┘ │
                                                      └──────────────────┘
```

1. **Captura Local en el Cliente (IndexedDB):**
   * Cada acción operativa (checklist completado, firma capturada, foto adjunta) genera un registro local en IndexedDB.
   * A cada registro se le asigna un `idempotency_key` (UUIDv4 generado en el móvil) y una marca de tiempo UTC (`client_timestamp`).
2. **Cola de Reintentos (Service Worker):**
   * El Service Worker escucha los eventos de red `online`.
   * Agrupa los eventos pendientes de la cola local y los envía en un solo batch hacia el endpoint `POST /api/v1/sync`.
3. **Reconciliación y Procesamiento Idempotente en el Servidor (Go):**
   * El backend procesa cada elemento del batch dentro de una transacción de PostgreSQL.
   * Si el `idempotency_key` (UUIDv4) ya existe en la base de datos (por un reintento duplicado ante microcortes), se ignora la inserción sin retornar error, garantizando idempotencia estricta.

---

## 4. Estrategia de Branding e Identidad Visual para Terratech

En el sector minero e industrial, el diseño superficial estilo startup digital genera desconfianza. Terratech proyecta **pesadez, confiabilidad institucional y precisión de ingeniería**.

### 1. Valores Visuales de la Marca
* **Robustez:** Sensación de solidez; un sistema que no colapsa ante cortes de energía o caídas de enlace en cordillera.
* **Precisión:** Información técnica estructurada, contrastes altos y ausencia de elementos ornamentales distractores.
* **Seguridad:** Transmisión visual de cumplimiento riguroso de normativas y protección de vidas en campo.

### 2. Paleta de Color Oficial

```
[ #0F172A ]  Azul Pizarra Oscuro  ── Base principal (Confianza, software industrial)
[ #1E293B ]  Grafito Técnico      ── Fondos de tarjetas y barras de navegación
[ #D97706 ]  Ámbar Seguridad      ── Acento de acción (Reflejo de maquinaria y EPP)
[ #10B981 ]  Verde Acreditado     ── Semáforo de cumplimiento operativo
[ #F59E0B ]  Ámbar Precaución     ── Semáforo de alerta preventiva (<15 días)
[ #EF4444 ]  Rojo Parada Crítica  ── Semáforo de bloqueo y peligro crítico
[ #F8FAFC ]  Blanco Humo          ── Texto principal y áreas de alto contraste
```

* **Color Primario (Estructura y Fondo Base):** `#0F172A` (Azul Pizarra / Slate 900). Solidez corporativa y confort visual en pantallas de uso intensivo.
* **Fondo Secundario (Superficies de Tarjetas y Menús):** `#1E293B` (Grafito Técnico / Slate 800).
* **Color Secundario / Acento:** `#D97706` (Ámbar Industrial / Amarillo reflectivo minero). Reservado exclusivamente para botones de acción (`CTA`), bordes destacados y estados de atención.
* **Colores de Semáforo Operativo:**
  * Verde Acreditado: `#10B981` (Cumplimiento >15 días / Conforme).
  * Ámbar Precaución: `#F59E0B` (Por vencer en <15 días / Observación menor).
  * Rojo Parada Crítica: `#EF4444` (Vencido / Bloqueado / Falla crítica de equipo).
* **Tipografía y Contraste:** `#F8FAFC` (Blanco Humo) para máxima legibilidad contra superficies oscuras.

### 3. Tipografía
* **Lectura General e Interfaz:** **Inter** o **Roboto**. Excelente nitidez y legibilidad bajo reflejo de luz solar directa.
* **Datos Numéricos, Códigos y Folios:** **JetBrains Mono** o **Space Grotesk**. Aplicada en DNIs, números de placa, horómetros, folios de inspección y marcas de tiempo UTC.

### 4. Concepto del Logotipo
* **Isotipo:** Síntesis geométrica que combina capas estratigráficas de terreno (suelo y minería) con un polígono firme o prisma que denota estabilidad arquitectónica y rigor técnico.
* **Tipografía del Logo:** Tipografía sans-serif de trazo grueso, en caja alta y con tracking extendido: **TERRATECH**, complementada con la leyenda en caja menor: *SISTEMAS OPERATIVOS INDUSTRIALES*.

### 5. Lector de Pantalla de Campo (Diseño UI/UX Industrial)
* **Botones Táctiles Grandes (Mínimo 48px de alto):** Dimensionados para pulsaciones seguras con dedos enguantados (guantes de badana o nitrilo) o pantallas con polvo de mina.
* **Modo de Alto Contraste:** Optimizado para lectura inmediata por supervisores y operadores expuestos a radiación solar intensa a más de 4,500 m.s.n.m.
