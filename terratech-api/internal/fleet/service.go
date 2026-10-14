package fleet

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Service struct {
	mu         sync.RWMutex
	vehicles   map[string]*Vehicle
	checklists []*PreUseChecklist
}

func NewService() *Service {
	s := &Service{
		vehicles:   make(map[string]*Vehicle),
		checklists: make([]*PreUseChecklist, 0),
	}
	s.seedData()
	return s
}

func (s *Service) seedData() {
	vehicles := []*Vehicle{
		{
			ID:           "v-01",
			Code:         "CAM-402",
			Plate:        "BCX-782",
			VehicleType:  "CAMIONETA_4X4",
			Make:         "Toyota",
			Model:        "Hilux 4x4 SRV",
			Year:         2023,
			OdometerKM:   42850,
			HourmeterHRS: 1200,
			IsLocked:     false,
			AssignedCrew: "Supervisión SSOMA",
			Status:       StatusOperativo,
		},
		{
			ID:           "v-02",
			Code:         "VOL-105",
			Plate:        "F4R-892",
			VehicleType:  "VOLQUETE",
			Make:         "Volvo",
			Model:        "FMX 480 8x4",
			Year:         2022,
			OdometerKM:   88400,
			HourmeterHRS: 3450,
			IsLocked:     false,
			AssignedCrew: "Transporte de Mineral",
			Status:       StatusOperativo,
		},
		{
			ID:           "v-03",
			Code:         "EXC-201",
			Plate:        "EXC-CAT-201",
			VehicleType:  "EXCAVADORA",
			Make:         "Caterpillar",
			Model:        "336D2 L",
			Year:         2021,
			OdometerKM:   0,
			HourmeterHRS: 5120,
			IsLocked:     false,
			AssignedCrew: "Movimiento de Tierras",
			Status:       StatusOperativo,
		},
	}

	for _, v := range vehicles {
		s.vehicles[v.ID] = v
	}
}

func (s *Service) GetVehicles(query string) []*Vehicle {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*Vehicle
	for _, v := range s.vehicles {
		if query != "" {
			q := strings.ToLower(query)
			if !strings.Contains(strings.ToLower(v.Code), q) &&
				!strings.Contains(strings.ToLower(v.Plate), q) &&
				!strings.Contains(strings.ToLower(v.Make), q) &&
				!strings.Contains(strings.ToLower(v.Model), q) {
				continue
			}
		}
		result = append(result, v)
	}
	return result
}

func (s *Service) GetVehicleByID(id string) (*Vehicle, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	v, exists := s.vehicles[id]
	if !exists {
		return nil, fmt.Errorf("vehículo con ID %s no encontrado", id)
	}
	return v, nil
}

// EvaluateChecklist procesa el checklist y aplica la lógica de bloqueo por fallas críticas
func (s *Service) EvaluateChecklist(req SubmitChecklistRequest) (*PreUseChecklist, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	vehicle, exists := s.vehicles[req.VehicleID]
	if !exists {
		return nil, fmt.Errorf("vehículo con ID %s no encontrado", req.VehicleID)
	}

	hasCriticalFailure := false
	hasNonCriticalFailure := false
	var criticalDetails []string

	for _, item := range req.Items {
		if item.Status == ItemNoConforme {
			if item.IsCritical {
				hasCriticalFailure = true
				obs := item.Observation
				if obs == "" {
					obs = "Falla detectada en inspección pre-uso"
				}
				criticalDetails = append(criticalDetails, fmt.Sprintf("%s (%s): %s", item.Description, item.Category, obs))
			} else {
				hasNonCriticalFailure = true
			}
		}
	}

	status := ChecklistConforme
	criticalDetailsStr := ""

	if hasCriticalFailure {
		status = ChecklistBloqueadoCritico
		criticalDetailsStr = strings.Join(criticalDetails, "; ")

		// Bloqueo inmediato del vehículo en el sistema
		vehicle.IsLocked = true
		vehicle.Status = StatusBloqueado
		vehicle.LockReason = fmt.Sprintf("Bloqueo de Garita: Falla crítica detectada (%s)", criticalDetailsStr)
	} else if hasNonCriticalFailure {
		status = ChecklistNoConforme
	}

	// Actualizar odómetro si es mayor
	if req.OdometerKM > vehicle.OdometerKM {
		vehicle.OdometerKM = req.OdometerKM
	}
	now := time.Now()
	vehicle.LastInspection = &now

	checklist := &PreUseChecklist{
		ID:               uuid.New().String(),
		IdempotencyKey:   req.IdempotencyKey,
		VehicleID:        vehicle.ID,
		VehiclePlate:     vehicle.Plate,
		OperatorName:     req.OperatorName,
		OperatorDNI:      req.OperatorDNI,
		InspectionDate:   now,
		OdometerKM:       req.OdometerKM,
		Status:           status,
		HasCriticalFail:  hasCriticalFailure,
		CriticalDetails:  criticalDetailsStr,
		DigitalSignature: req.DigitalSignature,
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		Items:            req.Items,
		Photos:           req.Photos,
		CreatedAt:        now,
	}

	s.checklists = append([]*PreUseChecklist{checklist}, s.checklists...)
	return checklist, nil
}

func (s *Service) GetChecklists(limit int) []*PreUseChecklist {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if limit <= 0 || limit > len(s.checklists) {
		limit = len(s.checklists)
	}
	return s.checklists[:limit]
}

func (s *Service) UnlockVehicle(vehicleID, supervisorName, reason string) (*Vehicle, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	v, exists := s.vehicles[vehicleID]
	if !exists {
		return nil, fmt.Errorf("vehículo no encontrado")
	}

	v.IsLocked = false
	v.Status = StatusOperativo
	v.LockReason = ""
	return v, nil
}
