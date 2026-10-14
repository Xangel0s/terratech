package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"terratech-api/internal/core"
	"terratech-api/internal/fleet"
	"terratech-api/internal/platform"
	"terratech-api/internal/ssoma"
	"terratech-api/pkg/sync"
)

func main() {
	// Configurar modo de release o debug
	env := os.Getenv("GIN_MODE")
	if env == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(platform.CORSMiddleware())

	// Inicialización de servicios de dominio (Clean Architecture)
	coreSvc := core.NewService()
	ssomaSvc := ssoma.NewService()
	fleetSvc := fleet.NewService()
	syncSvc := sync.NewService(ssomaSvc, fleetSvc)

	// Inicialización de manejadores HTTP
	coreHdr := core.NewHandler(coreSvc)
	ssomaHdr := ssoma.NewHandler(ssomaSvc)
	fleetHdr := fleet.NewHandler(fleetSvc)
	syncHdr := sync.NewHandler(syncSvc)

	// Enrutamiento versión 1
	apiV1 := router.Group("/api/v1")
	{
		// Endpoints públicos del Core
		coreHdr.RegisterRoutes(apiV1)

		// Endpoints protegidos / operativos
		ssomaHdr.RegisterRoutes(apiV1)
		fleetHdr.RegisterRoutes(apiV1)
		syncHdr.RegisterRoutes(apiV1)
	}

	// Raíz con banner del sistema
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"app":         "TERRATECH OS Industrial",
			"system":      "Sistema Operativo Minero & SSOMA",
			"version":     "2.4.0",
			"api_docs":    "/api/v1/health",
			"environment": "production_mining_camp",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf(`
╔══════════════════════════════════════════════════════════════════╗
║              TERRATECH INDUSTRIAL OS - API CORE                  ║
║           Gestión de Acreditaciones SSOMA & Flota Minera         ║
╠══════════════════════════════════════════════════════════════════╣
║  Puerto HTTP: %-51s║
║  Modo Offline: Outbox Processor Activo (Idempotencia UUIDv4)     ║
║  Tenancy: Consorcio San Cristóbal (Antamina / Las Bambas)        ║
╚══════════════════════════════════════════════════════════════════╝
`, ":"+port)

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Error crítico al iniciar servidor Terratech API: %v", err)
	}
}
