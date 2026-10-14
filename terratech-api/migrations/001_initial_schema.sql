-- ============================================================================
-- TERRATECH INDUSTRIAL OS: Esquema de Base de Datos PostgreSQL
-- Multi-Tenancy con Row Level Security (RLS), Auditoría JSONB e Idempotencia
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 1. NÚCLEO: TENANTS Y SEDES (EMPRESAS CONTRATISTAS Y UNIDADES MINERAS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruc VARCHAR(11) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    altitude_masl INT NOT NULL DEFAULT 4200, -- Altitud sobre el nivel del mar (msnm)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sites_tenant ON sites(tenant_id);

-- ----------------------------------------------------------------------------
-- 2. USUARIOS Y RBAC
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('GERENTE', 'SUPERINTENDENTE', 'SUPERVISOR_SSOMA', 'RESIDENTE', 'TECNICO', 'CONDUCTOR')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- ----------------------------------------------------------------------------
-- 3. PERSONAL (TRABAJADORES Y CUADRILLAS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    dni VARCHAR(8) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    crew VARCHAR(100) NOT NULL,
    roster_shift VARCHAR(50) NOT NULL DEFAULT '14x7',
    status VARCHAR(20) NOT NULL DEFAULT 'APTO' CHECK (status IN ('APTO', 'POR_VENCER', 'BLOQUEADO')),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_dni UNIQUE (tenant_id, dni)
);
CREATE INDEX IF NOT EXISTS idx_workers_tenant ON workers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workers_dni_trgm ON workers USING gin (dni gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_workers_name_trgm ON workers USING gin ((first_name || ' ' || last_name) gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 4. CREDENCIALES Y DOCUMENTOS SSOMA (EMO, SCTR, INDUCCIÓN, CERTIFICACIONES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('EMO', 'SCTR_SALUD', 'SCTR_PENSION', 'INDUCCION_GENERAL', 'TRABAJOS_ALTURA', 'TRABAJOS_CALIENTE', 'ESPACIOS_CONFINADOS', 'MANEJO_DEFENSIVO')),
    doc_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    clinic_or_issuer VARCHAR(255) NOT NULL,
    restriction_notes TEXT,
    file_url TEXT,
    sha256_hash VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'VIGENTE' CHECK (status IN ('VIGENTE', 'POR_VENCER', 'VENCIDO', 'RECHAZADO')),
    verified_by VARCHAR(100),
    verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_credentials_tenant_worker ON credentials(tenant_id, worker_id);
CREATE INDEX IF NOT EXISTS idx_credentials_expiry ON credentials(expiry_date);

-- ----------------------------------------------------------------------------
-- 5. FLOTA Y MAQUINARIA PESADA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    plate VARCHAR(10) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('CAMIONETA_4X4', 'VOLQUETE', 'EXCAVADORA', 'LINEA_AMARILLA', 'CARGADOR_FRONTAL', 'LUMINARIA')),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    odometer_km INT NOT NULL DEFAULT 0,
    hourmeter_hrs INT NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    lock_reason TEXT,
    assigned_crew VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'OPERATIVO' CHECK (status IN ('OPERATIVO', 'BLOQUEADO', 'EN_MANTENIMIENTO')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_plate UNIQUE (tenant_id, plate)
);
CREATE INDEX IF NOT EXISTS idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_trgm ON vehicles USING gin (plate gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 6. CHECKLISTS PRE-USO (INSPECCIÓN CON FIRMA TÁCTIL Y GEOLOCALIZACIÓN)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key UUID NOT NULL UNIQUE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    operator_name VARCHAR(255) NOT NULL,
    operator_dni VARCHAR(8) NOT NULL,
    inspection_date TIMESTAMPTZ NOT NULL,
    odometer_km INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('CONFORME', 'NO_CONFORME', 'BLOQUEADO_CRITICO')),
    has_critical_failure BOOLEAN NOT NULL DEFAULT FALSE,
    critical_failure_details TEXT,
    digital_signature TEXT NOT NULL, -- Sello SVG/Base64 capturado en campo
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Detalle C / NC / NA de cada ítem
    photos JSONB DEFAULT '[]'::jsonb,         -- URLs / Hashes de fotos de evidencia
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_checklists_tenant_vehicle ON checklists(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_checklists_idempotency ON checklists(idempotency_key);

-- ----------------------------------------------------------------------------
-- 7. MOTOR OFFLINE: EVENTOS OUTBOX E IDEMPOTENCIA ESTRICTA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outbox_events (
    idempotency_key UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    payload JSONB NOT NULL,
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_processed BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT
);
CREATE INDEX IF NOT EXISTS idx_outbox_tenant_event ON outbox_events(tenant_id, event_type);

-- ----------------------------------------------------------------------------
-- 8. AUDITORÍA INMUTABLE (LOG DE EVENTOS DE SEGURIDAD)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 9. CONFIGURACIÓN DE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de aislamiento por tenant activo en la sesión (current_setting('app.current_tenant_id'))
CREATE POLICY tenant_isolation_sites ON sites USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_users ON users USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_workers ON workers USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_credentials ON credentials USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_vehicles ON vehicles USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_checklists ON checklists USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_outbox ON outbox_events USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_audit ON audit_logs USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

-- ============================================================================
-- FIN DEL ESQUEMA DDL
-- ============================================================================
