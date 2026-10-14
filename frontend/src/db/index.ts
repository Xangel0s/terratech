import Dexie, { Table } from 'dexie';
import { WorkerProfile, FleetVehicle, PreUsoInspection, OutboxEvent } from '@/types';

export class TerratechDatabase extends Dexie {
  workers!: Table<WorkerProfile, string>;
  vehicles!: Table<FleetVehicle, string>;
  inspections!: Table<PreUsoInspection, string>;
  outbox_events!: Table<OutboxEvent, string>;

  constructor() {
    super('TerratechIndustrialOS_DB');
    this.version(1).stores({
      workers: 'id, dni, status, cuadrilla, fullName',
      vehicles: 'id, plate, code, type, status',
      inspections: 'id, idempotencyKey, vehicleId, operatorDni, synced',
      outbox_events: 'id, idempotencyKey, eventType, synced, createdAtUtc',
    });
  }
}

export const db = new TerratechDatabase();

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-1',
    fullName: 'Ing. María Elena Tapia',
    dni: '44892105',
    fotocheck: 'TT-797',
    cip: '210443',
    role: 'Ingeniera Geotécnica Senior',
    specialty: 'Monitoreo de Taludes',
    cuadrilla: 'Perforación y Voladura',
    area: 'Geología & Geotecnia',
    guardia: 'Tajo Sur (Guardia Día 7x7)',
    status: 'apto',
    statusLabel: 'APTO PARA INGRESO',
    biometricVerified: true,
    avatarInitials: 'MT',
    avatarBg: 'bg-emerald-50',
    avatarColor: 'text-emerald-800',
    avatarRing: 'ring-emerald-200',
    avatarUrl: '/avatars/maria_tapia.jpg',
    clinic: 'Clínica San José de Moquegua — Protocolo D.S. 024-2016 Anexo 7C (Gran Altura)',
    endorsement: 'Póliza Rímac Seguros #981240-2 — Endosada a favor de Anglo American Quellaveco S.A.',
    authorizationNotes: 'Licencia Interna M-04 — Autorizado para conducción en rampa y tajo abierto',
    credentials: [
      {
        id: 'c-1',
        name: 'EMO ANUAL (7C)',
        statusText: '100% SIN OBS.',
        expiryDate: '2026-01-15',
        status: 'conforme',
      },
      {
        id: 'c-2',
        name: 'SCTR SALUD',
        statusText: 'VIGENTE RÍMAC',
        expiryDate: '2025-06-30',
        status: 'conforme',
      },
      {
        id: 'c-3',
        name: 'SCTR PENSIÓN',
        statusText: 'VIGENTE ONP',
        expiryDate: '2025-06-30',
        status: 'conforme',
      },
      {
        id: 'c-4',
        name: 'INDUCCIÓN MINA',
        statusText: 'APROBADO (19/20)',
        expiryDate: '2026-03-10',
        status: 'conforme',
      },
      {
        id: 'c-5',
        name: 'LICENCIA / SUPV.',
        statusText: 'CAMIONETA 4X4',
        expiryDate: '2026-08-20',
        status: 'conforme',
      },
    ],
  },
  {
    id: 'w-2',
    fullName: 'Javier Paredes Silva',
    dni: '70182493',
    fotocheck: 'TT-WELD',
    role: 'Técnico Mecánico Planta Chancado',
    specialty: 'Soldador Calificado 6G',
    cuadrilla: 'Mantenimiento de Planta',
    area: 'Mantenimiento Concentradora',
    guardia: 'Guardia Noche (14x7)',
    status: 'por_vencer',
    statusLabel: 'POR VENCER (6 DÍAS)',
    biometricVerified: true,
    avatarInitials: 'JP',
    avatarBg: 'bg-amber-50',
    avatarColor: 'text-amber-800',
    avatarRing: 'ring-amber-200',
    avatarUrl: '/avatars/javier_paredes.jpg',
    clinic: 'Vence: 24 Oct 2025 — Apto para Trabajo en Altura & Espacios Confinados',
    endorsement: 'Póliza Mapfre #88219-4 — Se requiere adjuntar adenda del mes vigente para pase continuo',
    authorizationNotes: 'Válida hasta Feb 2026 — PETS de Bloqueo y LOTO aprobados 100%',
    credentials: [
      {
        id: 'c-6',
        name: 'EMO ANUAL (7C)',
        statusText: 'VIGENTE (ESPAC. CONF.)',
        expiryDate: '2025-10-24',
        status: 'conforme',
      },
      {
        id: 'c-7',
        name: 'SCTR SALUD',
        statusText: '6 DÍAS RESTANTES',
        expiryDate: '2025-03-31',
        status: 'por_vencer',
      },
      {
        id: 'c-8',
        name: 'SCTR PENSIÓN',
        statusText: '6 DÍAS RESTANTES',
        expiryDate: '2025-03-31',
        status: 'por_vencer',
      },
      {
        id: 'c-9',
        name: 'INDUCCIÓN PLANTA',
        statusText: 'APROBADO CONFORME',
        expiryDate: '2026-02-14',
        status: 'conforme',
      },
      {
        id: 'c-10',
        name: 'LICENCIA MANEJO',
        statusText: 'NO APLICA (TALLER)',
        expiryDate: 'N/A',
        status: 'no_aplica',
      },
    ],
  },
  {
    id: 'w-3',
    fullName: 'Roberto Arteaga Ramos',
    dni: '42109855',
    fotocheck: 'TT-VOLQ',
    role: 'Conductor de Volquete Scania G480',
    specialty: 'Acarreo de Mineral',
    cuadrilla: 'Movimiento de Tierras',
    area: 'Movimiento de Tierras',
    guardia: 'Tajo Abierto (Guardia Día 7x7)',
    status: 'bloqueado',
    statusLabel: 'ACCESO BLOQUEADO (EMO VENCIDO)',
    biometricVerified: false,
    avatarInitials: 'RA',
    avatarBg: 'bg-rose-50',
    avatarColor: 'text-rose-700',
    avatarRing: 'ring-rose-200',
    avatarUrl: '/avatars/roberto_arteaga.jpg',
    clinic: 'Vencido: 15 Mar 2025 — Bloqueo obligatorio Art. 118 D.S. 024-2016-EM',
    endorsement: 'Póliza La Positiva #10492-7 — Cobertura activa hasta 30 Abr 2025',
    authorizationNotes: 'Categoría Volquete Pesado — Inhabilitado automáticamente por falta de aptitud física',
    credentials: [
      {
        id: 'c-11',
        name: 'EMO ANUAL (7C)',
        statusText: 'EXPIRADO (2 DÍAS)',
        expiryDate: '2025-03-15',
        status: 'vencido',
      },
      {
        id: 'c-12',
        name: 'SCTR SALUD',
        statusText: 'VIGENTE LA POSITIVA',
        expiryDate: '2025-04-30',
        status: 'conforme',
      },
      {
        id: 'c-13',
        name: 'SCTR PENSIÓN',
        statusText: 'VIGENTE LA POSITIVA',
        expiryDate: '2025-04-30',
        status: 'conforme',
      },
      {
        id: 'c-14',
        name: 'INDUCCIÓN MINA',
        statusText: 'APROBADO (18/20)',
        expiryDate: '2025-12-05',
        status: 'conforme',
      },
      {
        id: 'c-15',
        name: 'LICENCIA / VOLQUETE',
        statusText: 'BLOQUEO PREVENTIVO',
        expiryDate: 'Supeditado a EMO',
        status: 'vencido',
      },
    ],
  },
  {
    id: 'w-4',
    fullName: 'Héctor Quispe Chura',
    dni: '70891234',
    fotocheck: 'TT-RIG02',
    role: 'Rigger Senior',
    specialty: 'Maniobras de Izaje Crítico',
    cuadrilla: 'Transporte y Acarreo',
    area: 'Mantenimiento de Planta',
    guardia: 'Guardia Día (14x7)',
    status: 'apto',
    statusLabel: 'APTO PARA INGRESO',
    biometricVerified: true,
    avatarInitials: 'HQ',
    avatarBg: 'bg-slate-100',
    avatarColor: 'text-slate-700',
    avatarRing: 'ring-slate-200',
    avatarUrl: '/avatars/hector_quispe.jpg',
    clinic: 'Vence: 05 Feb 2026 — Apto Gran Altura Geográfica y Esfuerzo Físico',
    endorsement: 'Pacífico Seguros #33481 — Vence: 30 Jun 2025',
    authorizationNotes: 'Rigger Nivel II - CICB América — Válido para tándem y cargas críticas',
    credentials: [
      {
        id: 'c-16',
        name: 'EMO ANUAL (7C)',
        statusText: '100% SIN RESTRICCIÓN',
        expiryDate: '2026-02-05',
        status: 'conforme',
      },
      {
        id: 'c-17',
        name: 'SCTR SALUD',
        statusText: 'VIGENTE PACÍFICO',
        expiryDate: '2025-06-30',
        status: 'conforme',
      },
      {
        id: 'c-18',
        name: 'SCTR PENSIÓN',
        statusText: 'VIGENTE ONP',
        expiryDate: '2025-06-30',
        status: 'conforme',
      },
      {
        id: 'c-19',
        name: 'INDUCCIÓN IZAJE',
        statusText: 'APROBADO (20/20)',
        expiryDate: '2026-01-28',
        status: 'conforme',
      },
      {
        id: 'c-20',
        name: 'CERTIF. RIGGER',
        statusText: 'HOMOLOGADO CICB',
        expiryDate: '2026-11-10',
        status: 'conforme',
      },
    ],
  },
];

export const INITIAL_VEHICLES: FleetVehicle[] = [
  {
    id: 'v-1',
    plate: 'V8A-891',
    code: 'CAM-042',
    type: 'Camioneta 4x4',
    brandModel: 'Toyota Hilux 4x4 D/C 2.8',
    assignedOperator: 'Ing. María Elena Tapia',
    lastInspectionDate: '2025-03-28 06:15',
    status: 'operativo',
    odometerOrHours: '42,150 KM',
  },
  {
    id: 'v-2',
    plate: 'B9C-714',
    code: 'VOL-108',
    type: 'Volquete',
    brandModel: 'Scania G480 8x4 Heavy Tipper',
    assignedOperator: 'Roberto Arteaga Ramos',
    lastInspectionDate: '2025-03-27 18:30',
    status: 'bloqueado_critico',
    odometerOrHours: '118,400 KM',
  },
  {
    id: 'v-3',
    plate: 'EXC-019',
    code: 'EXC-019',
    type: 'Excavadora',
    brandModel: 'CAT 349D2 Oruga Hidráulica',
    assignedOperator: 'Marcos Vilca Quispe',
    lastInspectionDate: '2025-03-28 07:00',
    status: 'operativo',
    odometerOrHours: '3,840 HORAS',
  },
  {
    id: 'v-4',
    plate: 'GRU-005',
    code: 'GRU-005',
    type: 'Grúa Móvil',
    brandModel: 'Liebherr LTM 1220 5.1 (220 Tn)',
    assignedOperator: 'Héctor Quispe Chura',
    lastInspectionDate: '2025-03-26 14:00',
    status: 'observado',
    odometerOrHours: '2,190 HORAS',
  },
];

export async function initializeDatabase() {
  const count = await db.workers.count();
  if (count === 0) {
    await db.workers.bulkAdd(INITIAL_WORKERS);
    await db.vehicles.bulkAdd(INITIAL_VEHICLES);
  } else {
    // Sincronizar avatares fotográficos generados en los registros locales existentes
    for (const initWorker of INITIAL_WORKERS) {
      if (initWorker.avatarUrl) {
        await db.workers.update(initWorker.id, { avatarUrl: initWorker.avatarUrl });
      }
    }
  }
}
