package sync

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
	router.POST("/sync", h.ProcessBatch)
	router.GET("/sync/events", h.GetEvents)
}

func (h *Handler) ProcessBatch(c *gin.Context) {
	var req BatchSyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload de sincronización inválido", "details": err.Error()})
		return
	}

	resp := h.service.ProcessBatch(req)
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetEvents(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	limit, _ := strconv.Atoi(limitStr)

	events := h.service.GetHistory(limit)
	c.JSON(http.StatusOK, gin.H{
		"count":  len(events),
		"events": events,
	})
}
