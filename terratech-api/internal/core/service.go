package core

import (
	"errors"
	"time"

	"terratech-api/internal/platform"
)

type Service struct {
	tenants []Tenant
	users   []User
	sites   []Site
}

func NewService() *Service {
	tenant := Tenant{
		ID:        "t-001-san-cristobal",
		RUC:       "20458963211",
		Name:      "Consorcio Minero San Cristóbal S.A.C.",
		TradeName: "San Cristóbal Minería",
		IsActive:  true,
		CreatedAt: time.Now().Add(-180 * 24 * time.Hour),
	}

	sites := []Site{
		{
			ID:           "site-01",
			TenantID:     tenant.ID,
			Code:         "ANT-01",
			Name:         "Unidad Minera Antamina",
			Location:     "Huari, Áncash",
			AltitudeMASL: 4300,
			IsActive:     true,
			CreatedAt:    time.Now().Add(-180 * 24 * time.Hour),
		},
		{
			ID:           "site-02",
			TenantID:     tenant.ID,
			Code:         "BAM-02",
			Name:         "Unidad Minera Las Bambas",
			Location:     "Cotabambas, Apurímac",
			AltitudeMASL: 4000,
			IsActive:     true,
			CreatedAt:    time.Now().Add(-120 * 24 * time.Hour),
		},
	}

	users := []User{
		{
			ID:        "u-001-sarah-jenkins",
			TenantID:  tenant.ID,
			Email:     "sarah.jenkins@terratech.pe",
			FullName:  "Ing. Sarah Jenkins",
			Role:      "SUPERVISOR_SSOMA",
			IsActive:  true,
			CreatedAt: time.Now().Add(-90 * 24 * time.Hour),
		},
		{
			ID:        "u-002-carlos-mendoza",
			TenantID:  tenant.ID,
			Email:     "carlos.mendoza@terratech.pe",
			FullName:  "Ing. Carlos Mendoza",
			Role:      "SUPERINTENDENTE",
			IsActive:  true,
			CreatedAt: time.Now().Add(-150 * 24 * time.Hour),
		},
	}

	return &Service{
		tenants: []Tenant{tenant},
		users:   users,
		sites:   sites,
	}
}

func (s *Service) Authenticate(req LoginRequest) (*LoginResponse, error) {
	var foundUser *User
	for _, u := range s.users {
		if u.Email == req.Email {
			foundUser = &u
			break
		}
	}

	// Demo password bypass for development
	if foundUser == nil {
		if req.Email == "sarah.jenkins@terratech.pe" || req.Email == "demo@terratech.pe" {
			foundUser = &s.users[0]
		} else {
			return nil, errors.New("credenciales inválidas o usuario no registrado")
		}
	}

	token, err := platform.GenerateToken(foundUser.ID, foundUser.TenantID, foundUser.Email, foundUser.Role)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:     token,
		User:      *foundUser,
		Tenant:    s.tenants[0],
		ExpiresIn: 86400,
	}, nil
}

func (s *Service) GetTenantInfo(tenantID string) (*Tenant, error) {
	for _, t := range s.tenants {
		if t.ID == tenantID {
			return &t, nil
		}
	}
	return &s.tenants[0], nil
}

func (s *Service) GetSites(tenantID string) []Site {
	var result []Site
	for _, site := range s.sites {
		if site.TenantID == tenantID {
			result = append(result, site)
		}
	}
	if len(result) == 0 {
		return s.sites
	}
	return result
}
