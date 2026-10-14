package sync

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"terratech-api/internal/fleet"
	"terratech-api/internal/ssoma"
)

type Service struct {
	mu           sync.RWMutex
	events       map[string]OutboxEvent
	eventHistory []OutboxEvent
	ssomaSvc     *ssoma.Service
	fleetSvc     *fleet.Service
}

func NewService(ssomaSvc *ssoma.Service, fleetSvc *fleet.Service) *Service {
	return &Service{
		events:       make(map[string]OutboxEvent),
		eventHistory: make([]OutboxEvent, 0),
		ssomaSvc:     ssomaSvc,
		fleetSvc:     fleetSvc,
	}
}

// ProcessBatch aplica la lógica de reconciliación idempotente por UUIDv4
func (s *Service) ProcessBatch(req BatchSyncRequest) BatchSyncResponse {
	s.mu.Lock()
	defer s.mu.Unlock()

	processed := 0
	duplicates := 0
	var syncedKeys []string
	now := time.Now()

	for _, event := range req.Events {
		// Validar que la idempotency key sea un UUID válido
		if _, err := uuid.Parse(event.IdempotencyKey); err != nil {
			// Si no es un UUID válido, generar uno determinista o ignorar
			continue
		}

		// Comprobar si ya fue procesado previamente
		if _, exists := s.events[event.IdempotencyKey]; exists {
			duplicates++
			syncedKeys = append(syncedKeys, event.IdempotencyKey)
			continue
		}

		// Aplicar cambio de estado según tipo de evento
		event.ServerReceived = now
		event.IsProcessed = true

		switch event.EventType {
		case "CHECKLIST_SUBMITTED":
			if s.fleetSvc != nil {
				var chkReq fleet.SubmitChecklistRequest
				if err := json.Unmarshal(event.Payload, &chkReq); err == nil {
					chkReq.IdempotencyKey = event.IdempotencyKey
					_, _ = s.fleetSvc.EvaluateChecklist(chkReq)
				}
			}
		case "DOCUMENT_UPLOADED":
			if s.ssomaSvc != nil {
				var docReq ssoma.UploadDocRequest
				if err := json.Unmarshal(event.Payload, &docReq); err == nil {
					_, _ = s.ssomaSvc.UploadDocument(docReq)
				}
			}
		}

		// Registrar evento en el Outbox server-side
		s.events[event.IdempotencyKey] = event
		s.eventHistory = append([]OutboxEvent{event}, s.eventHistory...)
		syncedKeys = append(syncedKeys, event.IdempotencyKey)
		processed++
	}

	return BatchSyncResponse{
		Status:            "SYNCED",
		ProcessedCount:    processed,
		DuplicatesIgnored: duplicates,
		SyncedKeys:        syncedKeys,
		Timestamp:         now,
		Message:           fmt.Sprintf("Sincronización completada: %d eventos procesados, %d duplicados descartados con seguridad.", processed, duplicates),
	}
}

func (s *Service) GetHistory(limit int) []OutboxEvent {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if limit <= 0 || limit > len(s.eventHistory) {
		limit = len(s.eventHistory)
	}
	return s.eventHistory[:limit]
}
