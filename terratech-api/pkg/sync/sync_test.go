package sync

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/google/uuid"
	"terratech-api/internal/fleet"
	"terratech-api/internal/ssoma"
)

func TestIdempotentSyncEngine(t *testing.T) {
	ssomaSvc := ssoma.NewService()
	fleetSvc := fleet.NewService()
	syncSvc := NewService(ssomaSvc, fleetSvc)

	key1 := uuid.New().String()
	key2 := uuid.New().String()

	payload1, _ := json.Marshal(fleet.SubmitChecklistRequest{
		VehicleID:        "v-01",
		OperatorName:     "Test Operator",
		OperatorDNI:      "12345678",
		OdometerKM:       45000,
		DigitalSignature: "sig",
		Items:            []fleet.ChecklistItem{},
	})

	batch := BatchSyncRequest{
		Events: []OutboxEvent{
			{
				IdempotencyKey:  key1,
				EventType:       "CHECKLIST_SUBMITTED",
				Payload:         payload1,
				ClientTimestamp: time.Now(),
			},
			{
				IdempotencyKey:  key2,
				EventType:       "WORKER_STATUS_CHANGED",
				Payload:         json.RawMessage(`{"worker_id":"w-01","status":"APTO"}`),
				ClientTimestamp: time.Now(),
			},
		},
	}

	// First pass: Both should be processed
	resp1 := syncSvc.ProcessBatch(batch)
	if resp1.ProcessedCount != 2 {
		t.Errorf("Expected 2 processed events in first pass, got %d", resp1.ProcessedCount)
	}
	if resp1.DuplicatesIgnored != 0 {
		t.Errorf("Expected 0 duplicates ignored in first pass, got %d", resp1.DuplicatesIgnored)
	}

	// Second pass with the EXACT same batch (simulating offline device reconnect retry):
	resp2 := syncSvc.ProcessBatch(batch)
	if resp2.ProcessedCount != 0 {
		t.Errorf("Expected 0 processed events in second pass (strict idempotence), got %d", resp2.ProcessedCount)
	}
	if resp2.DuplicatesIgnored != 2 {
		t.Errorf("Expected 2 duplicates ignored in second pass, got %d", resp2.DuplicatesIgnored)
	}

	// Third pass with mixed (1 new, 1 duplicate):
	key3 := uuid.New().String()
	mixedBatch := BatchSyncRequest{
		Events: []OutboxEvent{
			{
				IdempotencyKey:  key1, // Duplicate
				EventType:       "CHECKLIST_SUBMITTED",
				Payload:         payload1,
				ClientTimestamp: time.Now(),
			},
			{
				IdempotencyKey:  key3, // New
				EventType:       "GENERIC_EVENT",
				Payload:         json.RawMessage(`{}`),
				ClientTimestamp: time.Now(),
			},
		},
	}

	resp3 := syncSvc.ProcessBatch(mixedBatch)
	if resp3.ProcessedCount != 1 {
		t.Errorf("Expected 1 processed event in mixed pass, got %d", resp3.ProcessedCount)
	}
	if resp3.DuplicatesIgnored != 1 {
		t.Errorf("Expected 1 duplicate ignored in mixed pass, got %d", resp3.DuplicatesIgnored)
	}
}
