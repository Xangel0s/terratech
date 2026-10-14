export type ComplianceStatus = 'apto' | 'por_vencer' | 'bloqueado';

export interface DocumentCredential {
  id: string;
  name: string; // e.g., 'EMO ANUAL (7C)', 'SCTR SALUD', 'SCTR PENSIÓN', 'INDUCCIÓN MINA', 'LICENCIA / SUPV.'
  statusText: string;
  expiryDate: string; // YYYY-MM-DD
  status: 'conforme' | 'por_vencer' | 'vencido' | 'no_aplica';
  institution?: string;
  policyNumber?: string;
  extraNote?: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  dni: string;
  fotocheck: string;
  cip?: string;
  role: string;
  specialty: string;
  cuadrilla: string;
  area: string;
  guardia: string;
  status: ComplianceStatus;
  statusLabel: string;
  biometricVerified: boolean;
  avatarInitials: string;
  avatarBg: string;
  avatarColor: string;
  avatarRing: string;
  avatarUrl?: string;
  credentials: DocumentCredential[];
  clinic?: string;
  endorsement?: string;
  authorizationNotes?: string;
}

export interface FleetVehicle {
  id: string;
  plate: string;
  code: string;
  type: 'Camioneta 4x4' | 'Excavadora' | 'Volquete' | 'Compresor' | 'Grúa Móvil';
  brandModel: string;
  assignedOperator: string;
  lastInspectionDate: string;
  status: 'operativo' | 'observado' | 'bloqueado_critico';
  odometerOrHours: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  name: string;
  isCritical: boolean;
  status: 'C' | 'NC' | 'NA';
  observation?: string;
}

export interface PreUsoInspection {
  id: string;
  idempotencyKey: string;
  vehicleId: string;
  operatorDni: string;
  operatorName: string;
  dateUtc: string;
  items: ChecklistItem[];
  hasCriticalFailure: boolean;
  criticalItemsFailed: string[];
  signatureDataUrl?: string;
  photoDataUrl?: string;
  synced: boolean;
}

export interface OutboxEvent {
  id: string;
  idempotencyKey: string; // UUIDv4
  eventType: 'DOCUMENT_UPLOAD' | 'CHECKLIST_SUBMIT' | 'WORKER_STATUS_OVERRIDE';
  entityId?: string;
  payload: any;
  createdAtUtc: string;
  synced: boolean;
  retryCount: number;
}
