package ssoma

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
	group := router.Group("/ssoma")
	{
		group.GET("/workers", h.GetWorkers)
		group.GET("/workers/:id", h.GetWorkerByID)
		group.GET("/stats", h.GetStats)
		group.POST("/credentials", h.UploadDocument)
		group.POST("/dossier/compile", h.CompileDossier)
	}
}

func (h *Handler) GetWorkers(c *gin.Context) {
	query := c.Query("q")
	crew := c.Query("crew")
	status := c.Query("status")

	workers := h.service.GetWorkers(query, crew, status)
	c.JSON(http.StatusOK, gin.H{
		"count":   len(workers),
		"workers": workers,
	})
}

func (h *Handler) GetWorkerByID(c *gin.Context) {
	id := c.Param("id")
	worker, err := h.service.GetWorkerByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, worker)
}

func (h *Handler) GetStats(c *gin.Context) {
	stats := h.service.GetStats()
	c.JSON(http.StatusOK, stats)
}

func (h *Handler) UploadDocument(c *gin.Context) {
	var req UploadDocRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido para documento", "details": err.Error()})
		return
	}

	cred, err := h.service.UploadDocument(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Documento registrado y semáforo actualizado",
		"credential": cred,
	})
}

func (h *Handler) CompileDossier(c *gin.Context) {
	var req DossierCompileRequest
	_ = c.ShouldBindJSON(&req)

	resp := h.service.CompileDossier(req)
	c.JSON(http.StatusOK, resp)
}
