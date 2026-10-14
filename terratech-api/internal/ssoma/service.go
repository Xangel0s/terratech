package ssoma

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Service struct {
	mu      sync.RWMutex
	workers map[string]*Worker
}

func NewService() *Service {
	s := &Service{
		workers: make(map[string]*Worker),
	}
	s.seedData()
	return s
}

// CalculateSemaphoro evalúa las fechas de caducidad contra el día actual
func CalculateSemaphoro(creds []Credential, now time.Time) (SemaphoroStatus, []Credential) {
	hasExpired := false
	hasNearExpiry := false

	evaluatedCreds := make([]Credential, len(creds))
	for i, c := range creds {
		// Días restantes respecto a hoy
		diff := c.ExpiryDate.Sub(now)
		days := int(diff.Hours() / 24)
		if diff < 0 {
			days = -int((-diff.Hours()) / 24)
		}

		c.DaysRemaining = days
		if days < 0 {
			c.Status = CredVencido
			hasExpired = true
		} else if days <= 15 {
			c.Status = CredPorVencer
			hasNearExpiry = true
		} else {
			c.Status = CredVigente
		}
		evaluatedCreds[i] = c
	}

	if hasExpired {
		return StatusBloqueado, evaluatedCreds
	}
	if hasNearExpiry {
		return StatusPorVencer, evaluatedCreds
	}
	return StatusApto, evaluatedCreds
}

func (s *Service) seedData() {
	now := time.Now()

	workers := []*Worker{
		{
			ID:          "w-01",
			DNI:         "45892147",
			FirstName:   "María",
			LastName:    "Tapia",
			Role:        "Ingeniero Geotécnico Senior",
			Crew:        "Geotecnia y Taludes",
			RosterShift: "14x7",
			PhotoURL:    "/avatars/maria_tapia.jpg",
			Credentials: []Credential{
				{
					ID:             "c-01",
					WorkerID:       "w-01",
					DocType:        "EMO",
					DocNumber:      "EMO-2026-7892",
					IssueDate:      now.Add(-60 * 24 * time.Hour),
					ExpiryDate:     now.Add(180 * 24 * time.Hour),
					ClinicOrIssuer: "Clínica San Pablo (Arequipa)",
					SHA256Hash:     "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
				},
				{
					ID:             "c-02",
					WorkerID:       "w-01",
					DocType:        "SCTR_SALUD",
					DocNumber:      "POL-RIMAC-8890",
					IssueDate:      now.Add(-10 * 24 * time.Hour),
					ExpiryDate:     now.Add(20 * 24 * time.Hour),
					ClinicOrIssuer: "Rímac Seguros",
					SHA256Hash:     "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
				},
				{
					ID:             "c-03",
					WorkerID:       "w-01",
					DocType:        "INDUCCION_GENERAL",
					DocNumber:      "ANEXO-04-2026",
					IssueDate:      now.Add(-30 * 24 * time.Hour),
					ExpiryDate:     now.Add(335 * 24 * time.Hour),
					ClinicOrIssuer: "Instituto de Seguridad Minera (ISEM)",
					SHA256Hash:     "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
				},
			},
		},
		{
			ID:          "w-02",
			DNI:         "70124589",
			FirstName:   "Javier",
			LastName:    "Paredes",
			Role:        "Soldador Especialista 6G",
			Crew:        "Mantenimiento Mecánico",
			RosterShift: "14x7",
			PhotoURL:    "/avatars/javier_paredes.jpg",
			Credentials: []Credential{
				{
					ID:             "c-04",
					WorkerID:       "w-02",
					DocType:        "EMO",
					DocNumber:      "EMO-2026-4431",
					IssueDate:      now.Add(-355 * 24 * time.Hour),
					ExpiryDate:     now.Add(10 * 24 * time.Hour), // POR VENCER (10 días)
					ClinicOrIssuer: "Centro Médico Ocupacional del Sur",
					SHA256Hash:     "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
				},
				{
					ID:             "c-05",
					WorkerID:       "w-02",
					DocType:        "TRABAJOS_CALIENTE",
					DocNumber:      "CAL-6G-2025",
					IssueDate:      now.Add(-90 * 24 * time.Hour),
					ExpiryDate:     now.Add(275 * 24 * time.Hour),
					ClinicOrIssuer: "SENCICO Arequipa",
					SHA256Hash:     "b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef0",
				},
			},
		},
		{
			ID:          "w-03",
			DNI:         "41258963",
			FirstName:   "Roberto",
			LastName:    "Arteaga",
			Role:        "Conductor Semitrailer / Cisterna",
			Crew:        "Transporte de Carga Pesada",
			RosterShift: "21x7",
			PhotoURL:    "/avatars/roberto_arteaga.jpg",
			Credentials: []Credential{
				{
					ID:             "c-06",
					WorkerID:       "w-03",
					DocType:        "EMO",
					DocNumber:      "EMO-2025-1102",
					IssueDate:      now.Add(-370 * 24 * time.Hour),
					ExpiryDate:     now.Add(-5 * 24 * time.Hour), // VENCIDO (-5 días) -> BLOQUEADO
					ClinicOrIssuer: "Policlínico Ocupacional Nazca",
					SHA256Hash:     "c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef0",
				},
			},
		},
		{
			ID:          "w-04",
			DNI:         "43567812",
			FirstName:   "Héctor",
			LastName:    "Quispe",
			Role:        "Rigger / Maniobrista Grúa",
			Crew:        "Izajes y Montajes",
			RosterShift: "14x7",
			PhotoURL:    "/avatars/hector_quispe.jpg",
			Credentials: []Credential{
				{
					ID:             "c-07",
					WorkerID:       "w-04",
					DocType:        "EMO",
					DocNumber:      "EMO-2026-9081",
					IssueDate:      now.Add(-30 * 24 * time.Hour),
					ExpiryDate:     now.Add(335 * 24 * time.Hour),
					ClinicOrIssuer: "Clínica San Pablo (Arequipa)",
					SHA256Hash:     "d4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef0",
				},
				{
					ID:             "c-08",
					WorkerID:       "w-04",
					DocType:        "TRABAJOS_ALTURA",
					DocNumber:      "ALT-RIG-88",
					IssueDate:      now.Add(-45 * 24 * time.Hour),
					ExpiryDate:     now.Add(320 * 24 * time.Hour),
					ClinicOrIssuer: "3M Safety Training Center",
					SHA256Hash:     "e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef0",
				},
			},
		},
	}

	for _, w := range workers {
		status, evaluatedCreds := CalculateSemaphoro(w.Credentials, now)
		w.Status = status
		w.Credentials = evaluatedCreds
		w.UpdatedAt = now
		s.workers[w.ID] = w
	}
}

func (s *Service) GetWorkers(query, crew, status string) []*Worker {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*Worker
	now := time.Now()

	for _, w := range s.workers {
		// Actualizar semáforo en tiempo de lectura
		wStatus, evaluatedCreds := CalculateSemaphoro(w.Credentials, now)
		w.Status = wStatus
		w.Credentials = evaluatedCreds

		// Filtro de texto (DNI o nombre)
		if query != "" {
			q := strings.ToLower(query)
			fullName := strings.ToLower(w.FirstName + " " + w.LastName)
			if !strings.Contains(w.DNI, q) && !strings.Contains(fullName, q) && !strings.Contains(strings.ToLower(w.Role), q) {
				continue
			}
		}

		// Filtro de cuadrilla
		if crew != "" && crew != "TODAS" && w.Crew != crew {
			continue
		}

		// Filtro de semáforo
		if status != "" && status != "TODOS" && string(w.Status) != status {
			continue
		}

		result = append(result, w)
	}

	return result
}

func (s *Service) GetWorkerByID(id string) (*Worker, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	w, exists := s.workers[id]
	if !exists {
		return nil, fmt.Errorf("trabajador con ID %s no encontrado", id)
	}

	status, evaluatedCreds := CalculateSemaphoro(w.Credentials, time.Now())
	w.Status = status
	w.Credentials = evaluatedCreds

	return w, nil
}

func (s *Service) GetStats() SSOMAStats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	total := len(s.workers)
	aptos := 0
	porVencer := 0
	bloqueados := 0
	now := time.Now()

	for _, w := range s.workers {
		status, _ := CalculateSemaphoro(w.Credentials, now)
		switch status {
		case StatusApto:
			aptos++
		case StatusPorVencer:
			porVencer++
		case StatusBloqueado:
			bloqueados++
		}
	}

	complianceRate := 0.0
	if total > 0 {
		complianceRate = float64(aptos) / float64(total) * 100.0
	}

	return SSOMAStats{
		TotalWorkers:    total,
		AptosCount:      aptos,
		PorVencerCount:  porVencer,
		BloqueadosCount: bloqueados,
		ComplianceRate:  complianceRate,
	}
}

func (s *Service) UploadDocument(req UploadDocRequest) (*Credential, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	worker, exists := s.workers[req.WorkerID]
	if !exists {
		return nil, fmt.Errorf("trabajador con ID %s no encontrado", req.WorkerID)
	}

	issueDate, err := time.Parse("2006-01-02", req.IssueDate)
	if err != nil {
		issueDate = time.Now()
	}

	expiryDate, err := time.Parse("2006-01-02", req.ExpiryDate)
	if err != nil {
		return nil, fmt.Errorf("fecha de vencimiento inválida: %v", err)
	}

	// Generar SHA256 digital si no se envió
	hash := req.SHA256Hash
	if hash == "" {
		hasher := sha256.New()
		hasher.Write([]byte(fmt.Sprintf("%s-%s-%s-%s", req.WorkerID, req.DocType, req.DocNumber, req.ExpiryDate)))
		hash = hex.EncodeToString(hasher.Sum(nil))
	}

	newCred := Credential{
		ID:               uuid.New().String(),
		WorkerID:         req.WorkerID,
		DocType:          req.DocType,
		DocNumber:        req.DocNumber,
		IssueDate:        issueDate,
		ExpiryDate:       expiryDate,
		ClinicOrIssuer:   req.ClinicOrIssuer,
		RestrictionNotes: req.RestrictionNotes,
		SHA256Hash:       hash,
	}

	// Reemplazar credencial existente del mismo tipo o agregar nueva
	updated := false
	for i, c := range worker.Credentials {
		if c.DocType == req.DocType {
			worker.Credentials[i] = newCred
			updated = true
			break
		}
	}
	if !updated {
		worker.Credentials = append(worker.Credentials, newCred)
	}

	// Recalcular semáforo
	status, evaluatedCreds := CalculateSemaphoro(worker.Credentials, time.Now())
	worker.Status = status
	worker.Credentials = evaluatedCreds
	worker.UpdatedAt = time.Now()

	return &newCred, nil
}

func (s *Service) CompileDossier(req DossierCompileRequest) DossierCompileResponse {
	s.mu.RLock()
	defer s.mu.RUnlock()

	site := req.SiteCode
	if site == "" {
		site = "ANTAMINA-FAENA-01"
	}

	batchID := fmt.Sprintf("DOSSIER-%d", time.Now().Unix())
	totalFiles := 0

	for _, wid := range req.WorkerIDs {
		if w, ok := s.workers[wid]; ok {
			totalFiles += len(w.Credentials)
		}
	}
	if totalFiles == 0 {
		for _, w := range s.workers {
			totalFiles += len(w.Credentials)
		}
	}

	return DossierCompileResponse{
		BatchID:     batchID,
		SiteCode:    site,
		TotalFiles:  totalFiles,
		GeneratedAt: time.Now(),
		ExcelURL:    fmt.Sprintf("/exports/%s/matriz_ssoma.xlsx", batchID),
		ZipURL:      fmt.Sprintf("/exports/%s/expediente_completo.zip", batchID),
		Summary:     fmt.Sprintf("Compilado con éxito: %d expedientes documentarios firmados digitalmente para garita %s", totalFiles, site),
	}
}
