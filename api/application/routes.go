package application

import (
	"github.com/gin-gonic/gin"
	"github.com/iiurydias/challenge-bravo/api/application/handlers"
	"net/http"
)

func initializeApiRouter(handlers handlers.Handlers) http.Handler {
	r := gin.Default()
	r.POST("/currency", handlers.AddCurrency())
	r.DELETE("/currency/:id", handlers.RemoveCurrency())
	r.GET("/currency", handlers.ConvertCurrency())
	return r
}
