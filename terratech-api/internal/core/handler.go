package core

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/auth/login", h.Login)
	router.GET("/health", h.HealthCheck)
	router.GET("/core/tenant", h.GetTenant)
	router.GET("/core/sites", h.GetSites)
}

func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":      "OPERATIONAL",
		"system":      "TERRATECH OS Industrial",
		"version":     "2.4.0",
		"environment": "mining_camp_local",
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de credenciales inválido", "details": err.Error()})
		return
	}

	resp, err := h.service.Authenticate(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetTenant(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	tenantIDStr, _ := tenantID.(string)

	tenant, err := h.service.GetTenantInfo(tenantIDStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa no encontrada"})
		return
	}

	c.JSON(http.StatusOK, tenant)
}

func (h *Handler) GetSites(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	tenantIDStr, _ := tenantID.(string)

	sites := h.service.GetSites(tenantIDStr)
	c.JSON(http.StatusOK, sites)
}
