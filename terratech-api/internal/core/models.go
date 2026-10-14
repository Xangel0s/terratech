package core

import (
	"time"
)

type Tenant struct {
	ID        string    `json:"id"`
	RUC       string    `json:"ruc"`
	Name      string    `json:"name"`
	TradeName string    `json:"trade_name"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type Site struct {
	ID           string    `json:"id"`
	TenantID     string    `json:"tenant_id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	Location     string    `json:"location"`
	AltitudeMASL int       `json:"altitude_masl"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
}

type User struct {
	ID        string    `json:"id"`
	TenantID  string    `json:"tenant_id"`
	Email     string    `json:"email"`
	FullName  string    `json:"full_name"`
	Role      string    `json:"role"` // GERENTE, SUPERINTENDENTE, SUPERVISOR_SSOMA, RESIDENTE, TECNICO, CONDUCTOR
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token     string `json:"token"`
	User      User   `json:"user"`
	Tenant    Tenant `json:"tenant"`
	ExpiresIn int64  `json:"expires_in_seconds"`
}
