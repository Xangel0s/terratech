package fleet

import "time"

type VehicleStatus string

const (
	StatusOperativo       VehicleStatus = "OPERATIVO"
	StatusBloqueado       VehicleStatus = "BLOQUEADO"
	StatusEnMantenimiento VehicleStatus = "EN_MANTENIMIENTO"
)

type ChecklistItemStatus string

const (
	ItemConforme   ChecklistItemStatus = "C"
	ItemNoConforme ChecklistItemStatus = "NC"
	ItemNoAplica   ChecklistItemStatus = "NA"
)

type ChecklistStatus string

const (
	ChecklistConforme         ChecklistStatus = "CONFORME"
	ChecklistNoConforme       ChecklistStatus = "NO_CONFORME"
	ChecklistBloqueadoCritico ChecklistStatus = "BLOQUEADO_CRITICO"
)

type Vehicle struct {
	ID             string        `json:"id"`
	Code           string        `json:"code"`
	Plate          string        `json:"plate"`
	VehicleType    string        `json:"vehicle_type"`
	Make           string        `json:"make"`
	Model          string        `json:"model"`
	Year           int           `json:"year"`
	OdometerKM     int           `json:"odometer_km"`
	HourmeterHRS   int           `json:"hourmeter_hrs"`
	IsLocked       bool          `json:"is_locked"`
	LockReason     string        `json:"lock_reason,omitempty"`
	AssignedCrew   string        `json:"assigned_crew"`
	Status         VehicleStatus `json:"status"`
	LastInspection *time.Time    `json:"last_inspection,omitempty"`
}

type ChecklistItem struct {
	ID          string              `json:"id"`
	Category    string              `json:"category"`
	Description string              `json:"description"`
	Status      ChecklistItemStatus `json:"status"` // C, NC, NA
	IsCritical  bool                `json:"is_critical"`
	Observation string              `json:"observation,omitempty"`
}

type SubmitChecklistRequest struct {
	IdempotencyKey   string          `json:"idempotency_key" binding:"required"`
	VehicleID        string          `json:"vehicle_id" binding:"required"`
	OperatorName     string          `json:"operator_name" binding:"required"`
	OperatorDNI      string          `json:"operator_dni" binding:"required"`
	OdometerKM       int             `json:"odometer_km" binding:"required"`
	Items            []ChecklistItem `json:"items" binding:"required"`
	DigitalSignature string          `json:"digital_signature" binding:"required"`
	Latitude         float64         `json:"latitude"`
	Longitude        float64         `json:"longitude"`
	Photos           []string        `json:"photos,omitempty"`
}

type PreUseChecklist struct {
	ID               string          `json:"id"`
	IdempotencyKey   string          `json:"idempotency_key"`
	VehicleID        string          `json:"vehicle_id"`
	VehiclePlate     string          `json:"vehicle_plate"`
	OperatorName     string          `json:"operator_name"`
	OperatorDNI      string          `json:"operator_dni"`
	InspectionDate   time.Time       `json:"inspection_date"`
	OdometerKM       int             `json:"odometer_km"`
	Status           ChecklistStatus `json:"status"`
	HasCriticalFail  bool            `json:"has_critical_failure"`
	CriticalDetails  string          `json:"critical_details,omitempty"`
	DigitalSignature string          `json:"digital_signature"`
	Latitude         float64         `json:"latitude"`
	Longitude        float64         `json:"longitude"`
	Items            []ChecklistItem `json:"items"`
	Photos           []string        `json:"photos,omitempty"`
	CreatedAt        time.Time       `json:"created_at"`
}
