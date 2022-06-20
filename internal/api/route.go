package api

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/currency"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/currency/conversion"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/health_check"
)

// defaultRouter is the default router path
const defaultRouter = "/api/v1"

// Routes define all routes of the api
func (s *Server) Routes() *gin.Engine {
	var r = gin.Default()
	// set default router path
	var api = r.Group(defaultRouter)

	//health check route
	api.GET("/health/", health_check.Handler)
	//currency routes
	var cRouter = api.Group("/currency")
	{
		var cHandler = currency.NewHandler(s.Repository)
		// create currency
		cRouter.POST("/", cHandler.Create)
		// get all currency
		cRouter.GET("/", cHandler.GetAll)
		// get currency by code
		cRouter.GET("/:code", cHandler.GetByCode)
		// patch the currency by code
		cRouter.PATCH("/:code", cHandler.Update)
		// delete the currency by code
		cRouter.DELETE("/:code", cHandler.Delete)

		// handler to convert currency
		conversionHandler := conversion.NewHandler(s.Repository)
		cRouter.GET("/conversion", conversionHandler.Handle)
	}
	return r
}
