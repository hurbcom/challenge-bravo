package api

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/currency"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/currency/conversion"
	"github.com/joaohgf/challenge-bravo/internal/api/handler/health_check"
)

func (s *Server) Routes() *gin.Engine {
	var r = gin.Default()
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
		//
		// get currency by name
		cRouter.GET("/:code", cHandler.GetByCode)

		cRouter.PATCH("/:code", cHandler.Update)

		//cRouter.PUT("/")
		//cRouter.DELETE("/")

		conversionHandler := conversion.NewHandler(s.Repository)
		cRouter.GET("/conversion", conversionHandler.Handle)
	}
	return r
}
