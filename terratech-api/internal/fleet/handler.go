package fleet

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	group := router.Group("/fleet")
	{
		group.GET("/vehicles", h.GetVehicles)
		group.GET("/vehicles/:id", h.GetVehicleByID)
		group.POST("/checklists", h.SubmitChecklist)
		group.GET("/checklists", h.GetChecklists)
		group.POST("/vehicles/:id/unlock", h.UnlockVehicle)
	}
}

func (h *Handler) GetVehicles(c *gin.Context) {
	q := c.Query("q")
	vehicles := h.service.GetVehicles(q)
	c.JSON(http.StatusOK, gin.H{
		"count":    len(vehicles),
		"vehicles": vehicles,
	})
}

func (h *Handler) GetVehicleByID(c *gin.Context) {
	id := c.Param("id")
	v, err := h.service.GetVehicleByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, v)
}

func (h *Handler) SubmitChecklist(c *gin.Context) {
	var req SubmitChecklistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido para checklist pre-uso", "details": err.Error()})
		return
	}

	checklist, err := h.service.EvaluateChecklist(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	statusCode := http.StatusCreated
	if checklist.HasCriticalFail {
		// Retornar 201 pero con status BLOQUEADO_CRITICO
		c.JSON(statusCode, gin.H{
			"message":   "ALERTA CRÍTICA: Se detectó una no conformidad crítica. El vehículo ha sido bloqueado en garita.",
			"checklist": checklist,
			"locked":    true,
		})
		return
	}

	c.JSON(statusCode, gin.H{
		"message":   "Checklist pre-uso registrado exitosamente.",
		"checklist": checklist,
		"locked":    false,
	})
}

func (h *Handler) GetChecklists(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "20")
	limit, _ := strconv.Atoi(limitStr)

	checklists := h.service.GetChecklists(limit)
	c.JSON(http.StatusOK, gin.H{
		"count":      len(checklists),
		"checklists": checklists,
	})
}

func (h *Handler) UnlockVehicle(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		SupervisorName string `json:"supervisor_name"`
		Reason         string `json:"reason"`
	}
	_ = c.ShouldBindJSON(&req)

	v, err := h.service.UnlockVehicle(id, req.SupervisorName, req.Reason)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vehículo desbloqueado para operaciones",
		"vehicle": v,
	})
}
