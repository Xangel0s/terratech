/**
 * TERRATECH Sync Service
 * Transmisión de eventos Outbox con idempotencia UUIDv4 hacia Terratech API Core (Go)
 */

import { OutboxEvent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SyncResult {
  success: boolean;
  processedCount: number;
  duplicatesIgnored: number;
  message: string;
  isOffline: boolean;
}

export async function transmitOutboxBatch(events: OutboxEvent[]): Promise<SyncResult> {
  if (events.length === 0) {
    return {
      success: true,
      processedCount: 0,
      duplicatesIgnored: 0,
      message: 'No hay eventos pendientes en la cola local Outbox.',
      isOffline: false,
    };
  }

  const payload = {
    events: events.map((e) => ({
      idempotency_key: e.idempotencyKey,
      event_type: e.eventType,
      entity_id: e.entityId || '',
      payload: e.payload,
      client_timestamp: e.createdAtUtc,
    })),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast offline detection

    const response = await fetch(`${API_BASE_URL}/api/v1/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        processedCount: data.processed_count ?? events.length,
        duplicatesIgnored: data.duplicates_ignored ?? 0,
        message: data.message || `Sincronizados ${events.length} eventos exitosamente.`,
        isOffline: false,
      };
    } else {
      return {
        success: false,
        processedCount: 0,
        duplicatesIgnored: 0,
        message: `Servidor retornó error ${response.status}`,
        isOffline: false,
      };
    }
  } catch (error) {
    // Si no hay conexión o timeout, registrar como modo desconectado
    return {
      success: true, // Sigue siendo exitoso a nivel de cliente para mantener resiliencia offline
      processedCount: events.length,
      duplicatesIgnored: 0,
      message: `Modo Faena Desconectada: ${events.length} eventos preservados en IndexedDB local con UUIDv4.`,
      isOffline: true,
    };
  }
}
