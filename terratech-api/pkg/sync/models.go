package sync

import (
	"encoding/json"
	"time"
)

type OutboxEvent struct {
	IdempotencyKey  string          `json:"idempotency_key" binding:"required"`
	EventType       string          `json:"event_type" binding:"required"` // CHECKLIST_SUBMITTED, DOCUMENT_UPLOADED, VEHICLE_LOCKED, WORKER_STATUS_CHANGED
	EntityID        string          `json:"entity_id"`
	Payload         json.RawMessage `json:"payload" binding:"required"`
	ClientTimestamp time.Time       `json:"client_timestamp"`
	ServerReceived  time.Time       `json:"server_received_at"`
	IsProcessed     bool            `json:"is_processed"`
}

type BatchSyncRequest struct {
	Events []OutboxEvent `json:"events" binding:"required"`
}

type BatchSyncResponse struct {
	Status            string    `json:"status"` // SYNCED, PARTIAL_ERROR
	ProcessedCount    int       `json:"processed_count"`
	DuplicatesIgnored int       `json:"duplicates_ignored"`
	SyncedKeys        []string  `json:"synced_keys"`
	Timestamp         time.Time `json:"timestamp"`
	Message           string    `json:"message"`
}
