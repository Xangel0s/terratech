package ssoma

import "time"

type SemaphoroStatus string

const (
	StatusApto      SemaphoroStatus = "APTO"
	StatusPorVencer SemaphoroStatus = "POR_VENCER"
	StatusBloqueado SemaphoroStatus = "BLOQUEADO"
)

type CredentialStatus string

const (
	CredVigente   CredentialStatus = "VIGENTE"
	CredPorVencer CredentialStatus = "POR_VENCER"
	CredVencido   CredentialStatus = "VENCIDO"
	CredRechazado CredentialStatus = "RECHAZADO"
)

type Credential struct {
	ID               string           `json:"id"`
	WorkerID         string           `json:"worker_id"`
	DocType          string           `json:"doc_type"` // EMO, SCTR_SALUD, SCTR_PENSION, INDUCCION_GENERAL, TRABAJOS_ALTURA, TRABAJOS_CALIENTE
	DocNumber        string           `json:"doc_number"`
	IssueDate        time.Time        `json:"issue_date"`
	ExpiryDate       time.Time        `json:"expiry_date"`
	ClinicOrIssuer   string           `json:"clinic_or_issuer"`
	RestrictionNotes string           `json:"restriction_notes,omitempty"`
	SHA256Hash       string           `json:"sha256_hash"`
	Status           CredentialStatus `json:"status"`
	DaysRemaining    int              `json:"days_remaining"`
}

type Worker struct {
	ID          string          `json:"id"`
	DNI         string          `json:"dni"`
	FirstName   string          `json:"first_name"`
	LastName    string          `json:"last_name"`
	Role        string          `json:"role"`
	Crew        string          `json:"crew"`
	RosterShift string          `json:"roster_shift"`
	Status      SemaphoroStatus `json:"status"`
	PhotoURL    string          `json:"photo_url"`
	Credentials []Credential    `json:"credentials"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

type SSOMAStats struct {
	TotalWorkers    int     `json:"total_workers"`
	AptosCount      int     `json:"aptos_count"`
	PorVencerCount  int     `json:"por_vencer_count"`
	BloqueadosCount int     `json:"bloqueados_count"`
	ComplianceRate  float64 `json:"compliance_rate"`
}

type UploadDocRequest struct {
	WorkerID         string `json:"worker_id" binding:"required"`
	DocType          string `json:"doc_type" binding:"required"`
	DocNumber        string `json:"doc_number" binding:"required"`
	IssueDate        string `json:"issue_date" binding:"required"`  // YYYY-MM-DD
	ExpiryDate       string `json:"expiry_date" binding:"required"` // YYYY-MM-DD
	ClinicOrIssuer   string `json:"clinic_or_issuer" binding:"required"`
	RestrictionNotes string `json:"restriction_notes"`
	FileBase64       string `json:"file_base64"`
	SHA256Hash       string `json:"sha256_hash"`
}

type DossierCompileRequest struct {
	WorkerIDs []string `json:"worker_ids"`
	SiteCode  string   `json:"site_code"`
}

type DossierCompileResponse struct {
	BatchID     string    `json:"batch_id"`
	SiteCode    string    `json:"site_code"`
	TotalFiles  int       `json:"total_files"`
	GeneratedAt time.Time `json:"generated_at"`
	ExcelURL    string    `json:"excel_url"`
	ZipURL      string    `json:"zip_url"`
	Summary     string    `json:"summary"`
}
