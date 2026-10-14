# Estructura del Proyecto y Arquitectura del Sistema: Terratech

Terratech implementa un diseño de software altamente desacoplado, concebido bajo los principios de **Clean Architecture** y modularidad por dominios para permitir la activación de nuevos módulos de negocio sin alterar el núcleo del sistema.

---

## 1. Diagrama de Arquitectura del Sistema

```
                    ┌──────────────────────────────────────────┐
                    │               CLIENTE PWA                │
                    │   React / Tailwind / IndexedDB (Dexie)   │
                    └─────────────────────┬────────────────────┘
                                          │ Sync / REST API
                    ┌─────────────────────▼────────────────────┐
                    │              BACKEND EN GO               │
                    │   Gin / Clean Architecture / JWT Auth    │
                    └──────┬──────────────┬──────────────┬─────┘
                           │              │              │
              ┌────────────▼───┐   ┌──────▼────────┐   ┌─▼──────────────┐
              │  MÓDULO SSOMA  │   │ MÓDULO FLOTA  │   │  MÓDULO TAREO  │
              │  (EMO / SCTR)  │   │  (Checklists) │   │  (Turnos 14x7) │
              └────────────┬───┘   └──────┬────────┘   └─┬──────────────┘
                           │              │              │
                    ┌──────▼──────────────▼──────────────▼─────┐
                    │            POSTGRESQL (ACID)             │
                    │      Multi-Tenant + Auditoría JSONB      │
                    └──────────────────────────────────────────┘
```

---

## 2. Estructura de Directorios del Backend en Go

El backend se organiza por capas y dominios dentro del directorio `internal/`, aislando la lógica de negocio de los detalles de infraestructura:

```text
terratech-api/
├── cmd/
│   └── api/
│       └── main.go            # Punto de entrada, inyección de dependencias y arranque del servidor HTTP
├── internal/
│   ├── core/                  # NÚCLEO: Empresas, Sedes, Usuarios, Autenticación y RBAC
│   │   ├── handler.go         # Endpoints REST y parseo de peticiones HTTP
│   │   ├── service.go         # Reglas de negocio del core y validaciones maestras
│   │   └── repository.go      # Consultas SQL a PostgreSQL con soporte RLS
│   ├── ssoma/                 # MÓDULO 1: Semáforo de EMO, SCTR y Pases de Mina
│   │   ├── handler.go         # Endpoints para semáforos, alertas y generación de dossier ZIP/Excel
│   │   ├── service.go         # Lógica de cálculo de vencimientos (>15 días, <=15 días, vencido)
│   │   └── repository.go      # Persistencia de documentos médicos y pólizas
│   ├── fleet/                 # MÓDULO 2: Checklists Pre-Uso de Maquinaria y Vehículos
│   │   ├── handler.go         # Recepción de inspecciones, firmas y evidencias fotográficas
│   │   ├── service.go         # Evaluación de ítems críticos y reglas de bloqueo preventivo
│   │   └── repository.go      # Almacenamiento de fichas técnicas y estados de inspección
│   └── platform/              # Servicios compartidos de infraestructura
│       ├── database.go        # Conexión pgx pool, migraciones y configuración RLS
│       └── middleware.go      # Autenticación JWT, Rate Limiting y CORS
└── pkg/
    └── sync/                  # MOTOR OFFLINE: Procesador de Outbox y reconciliación idempotente (UUIDv4)
```

### Principios de la Organización Modular:
1. **Desacoplamiento Estricto:** Cada módulo en `internal/` expone su propia tríada `handler.go`, `service.go` y `repository.go`.
2. **Extensibilidad Plug-and-Play:** La incorporación de nuevos módulos (ej. `internal/tareo`, `internal/epp`) se realiza añadiendo un nuevo paquete sin modificar los dominios existentes.
3. **Inyección de Dependencias en `cmd/api/main.go`:** La conexión a la base de datos se inyecta desde `platform/database.go` a cada repositorio, de ahí a los servicios y finalmente a los manejadores de ruta de Gin.

---

## 3. Modelo de Persistencia y Multi-Tenancy

* **Aislamiento Multi-Tenant:**
  * Implementado mediante **Row-Level Security (RLS)** en PostgreSQL.
  * Todas las tablas transaccionales incluyen la columna `tenant_id` vinculada a la empresa contratista correspondiente.
* **Auditoría e Inmutabilidad:**
  * Uso de columnas `JSONB` para almacenar instantáneas (*snapshots*) de inspecciones, firmas digitales y cambios de estatus documental.
* **Procesamiento Idempotente:**
  * La tabla de eventos offline utiliza la clave primaria natural `idempotency_key UUID PRIMARY KEY` para descartar envíos duplicados automáticamente.

---

## 4. Hoja de Ruta de Ejecución Técnica (Roadmap)

Cronograma de implementación estructurado en 3 semanas para entregar el MVP operativo:

```text
SEMANA 1: Configuración Base y Modelado
├── Registrar dominio .pe y configurar registros DNS básicos
├── Diseñar el esquema de base de datos relacional (DDL) en PostgreSQL
└── Montar la estructura modular en Go con Gin y autenticación por JWT

SEMANA 2: Lógica Offline y Módulos MVP
├── Configurar el Service Worker y el almacenamiento local IndexedDB con Dexie.js
├── Construir el Módulo 1 (Semáforo de EMO/SCTR con alertas predictivas)
└── Construir el Módulo 2 (Checklists de inspección con soporte offline y firmas)

SEMANA 3: Interfaz y Branding
├── Implementar el diseño con la paleta industrial (Azul Pizarra y Ámbar)
├── Poblar el entorno demo con datos realistas de contratistas locales
└── Validar la sincronización offline en pruebas de red desconectada
```
