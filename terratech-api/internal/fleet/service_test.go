package fleet

import (
	"testing"
)

func TestEvaluateChecklistCriticalFailure(t *testing.T) {
	service := NewService()

	// Initial check: CAM-402 is OPERATIVO and not locked
	v, err := service.GetVehicleByID("v-01")
	if err != nil {
		t.Fatalf("Failed to get vehicle: %v", err)
	}
	if v.IsLocked || v.Status != StatusOperativo {
		t.Fatalf("Expected vehicle to be initially unlocked and OPERATIVO")
	}

	// 1. Submit checklist with a CRITICAL failure (Brakes NC)
	reqCritical := SubmitChecklistRequest{
		IdempotencyKey:   "00000000-0000-0000-0000-000000000001",
		VehicleID:        "v-01",
		OperatorName:     "Roberto Arteaga",
		OperatorDNI:      "41258963",
		OdometerKM:       43100,
		DigitalSignature: "svg-signature-data",
		Items: []ChecklistItem{
			{
				ID:          "item-1",
				Category:    "Sistemas Críticos",
				Description: "Frenos de servicio y estacionamiento",
				Status:      ItemNoConforme,
				IsCritical:  true,
				Observation: "Pérdida de presión en pedal principal",
			},
			{
				ID:          "item-2",
				Category:    "Luces",
				Description: "Faros neblineros",
				Status:      ItemConforme,
				IsCritical:  false,
			},
		},
	}

	checklist, err := service.EvaluateChecklist(reqCritical)
	if err != nil {
		t.Fatalf("Failed to evaluate checklist: %v", err)
	}

	if !checklist.HasCriticalFail {
		t.Errorf("Expected checklist to have critical failure")
	}
	if checklist.Status != ChecklistBloqueadoCritico {
		t.Errorf("Expected checklist status %s, got %s", ChecklistBloqueadoCritico, checklist.Status)
	}

	// Verify vehicle state was locked in memory
	vAfter, _ := service.GetVehicleByID("v-01")
	if !vAfter.IsLocked {
		t.Errorf("Expected vehicle to be locked after critical failure")
	}
	if vAfter.Status != StatusBloqueado {
		t.Errorf("Expected vehicle status %s, got %s", StatusBloqueado, vAfter.Status)
	}
	if vAfter.OdometerKM != 43100 {
		t.Errorf("Expected vehicle odometer to be updated to 43100, got %d", vAfter.OdometerKM)
	}

	// 2. Unlock vehicle by supervisor
	unlockedV, err := service.UnlockVehicle("v-01", "Ing. Sarah Jenkins", "Frenos purgados y verificados en taller")
	if err != nil {
		t.Fatalf("Failed to unlock vehicle: %v", err)
	}
	if unlockedV.IsLocked || unlockedV.Status != StatusOperativo {
		t.Errorf("Expected vehicle to be unlocked and OPERATIVO after supervisor override")
	}

	// 3. Submit checklist with ONLY non-critical failure (Luces NC)
	reqNonCritical := SubmitChecklistRequest{
		IdempotencyKey:   "00000000-0000-0000-0000-000000000002",
		VehicleID:        "v-01",
		OperatorName:     "Roberto Arteaga",
		OperatorDNI:      "41258963",
		OdometerKM:       43150,
		DigitalSignature: "svg-signature-data",
		Items: []ChecklistItem{
			{
				ID:          "item-1",
				Category:    "Sistemas Críticos",
				Description: "Frenos de servicio",
				Status:      ItemConforme,
				IsCritical:  true,
			},
			{
				ID:          "item-2",
				Category:    "Accesorios",
				Description: "Circulina ámbar estroboscópica",
				Status:      ItemNoConforme,
				IsCritical:  false,
				Observation: "Foco de circulina quemado",
			},
		},
	}

	chk2, err := service.EvaluateChecklist(reqNonCritical)
	if err != nil {
		t.Fatalf("Failed to evaluate second checklist: %v", err)
	}

	if chk2.HasCriticalFail {
		t.Errorf("Checklist with non-critical failure should not have critical failure flag")
	}
	if chk2.Status != ChecklistNoConforme {
		t.Errorf("Expected status %s, got %s", ChecklistNoConforme, chk2.Status)
	}

	// Vehicle should NOT be locked
	vFinal, _ := service.GetVehicleByID("v-01")
	if vFinal.IsLocked {
		t.Errorf("Vehicle should not be locked for non-critical failures")
	}
}
