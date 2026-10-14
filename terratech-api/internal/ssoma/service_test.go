package ssoma

import (
	"testing"
	"time"
)

func TestCalculateSemaphoro(t *testing.T) {
	now := time.Date(2026, 10, 12, 12, 0, 0, 0, time.UTC)

	t.Run("All documents valid > 15 days yields APTO", func(t *testing.T) {
		creds := []Credential{
			{DocType: "EMO", ExpiryDate: now.Add(30 * 24 * time.Hour)},
			{DocType: "SCTR_SALUD", ExpiryDate: now.Add(25 * 24 * time.Hour)},
		}

		status, evaluated := CalculateSemaphoro(creds, now)
		if status != StatusApto {
			t.Errorf("Expected status %s, got %s", StatusApto, status)
		}
		if evaluated[0].Status != CredVigente || evaluated[1].Status != CredVigente {
			t.Errorf("Expected both credentials to be VIGENTE")
		}
	})

	t.Run("Document expiring in <= 15 days yields POR_VENCER", func(t *testing.T) {
		creds := []Credential{
			{DocType: "EMO", ExpiryDate: now.Add(60 * 24 * time.Hour)},
			{DocType: "SCTR_SALUD", ExpiryDate: now.Add(10 * 24 * time.Hour)}, // 10 days
		}

		status, evaluated := CalculateSemaphoro(creds, now)
		if status != StatusPorVencer {
			t.Errorf("Expected status %s, got %s", StatusPorVencer, status)
		}
		if evaluated[1].Status != CredPorVencer {
			t.Errorf("Expected second credential to be POR_VENCER, got %s", evaluated[1].Status)
		}
	})

	t.Run("Document expired yields BLOQUEADO", func(t *testing.T) {
		creds := []Credential{
			{DocType: "EMO", ExpiryDate: now.Add(-2 * 24 * time.Hour)}, // -2 days expired
			{DocType: "SCTR_SALUD", ExpiryDate: now.Add(40 * 24 * time.Hour)},
		}

		status, evaluated := CalculateSemaphoro(creds, now)
		if status != StatusBloqueado {
			t.Errorf("Expected status %s, got %s", StatusBloqueado, status)
		}
		if evaluated[0].Status != CredVencido {
			t.Errorf("Expected first credential to be VENCIDO, got %s", evaluated[0].Status)
		}
	})
}

func TestSSOMAServiceDocumentUpload(t *testing.T) {
	service := NewService()

	// Roberto Arteaga has an expired EMO and is initially BLOQUEADO
	worker, err := service.GetWorkerByID("w-03")
	if err != nil {
		t.Fatalf("Failed to get worker: %v", err)
	}
	if worker.Status != StatusBloqueado {
		t.Fatalf("Expected Roberto Arteaga to be initially BLOQUEADO, got %s", worker.Status)
	}

	// Upload new EMO valid for 1 year
	futureDate := time.Now().Add(365 * 24 * time.Hour).Format("2006-01-02")
	_, err = service.UploadDocument(UploadDocRequest{
		WorkerID:       "w-03",
		DocType:        "EMO",
		DocNumber:      "EMO-2026-RENOVADO",
		IssueDate:      time.Now().Format("2006-01-02"),
		ExpiryDate:     futureDate,
		ClinicOrIssuer: "Policlínico Ocupacional Nazca",
		SHA256Hash:     "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
	})
	if err != nil {
		t.Fatalf("Failed to upload renewal document: %v", err)
	}

	// Verify worker status is now APTO
	updatedWorker, _ := service.GetWorkerByID("w-03")
	if updatedWorker.Status != StatusApto {
		t.Errorf("Expected Roberto Arteaga to be APTO after renewal, got %s", updatedWorker.Status)
	}
}
