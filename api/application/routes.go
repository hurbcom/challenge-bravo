package application

import (
	"github.com/gin-gonic/gin"
	"github.com/iiurydias/challenge-bravo/api/application/controllers/currency"
	"net/http"
)

func initializeApiRouter(controller *currency.Currency) http.Handler {
	r := gin.Default()
	r.POST("/currency", controller.AddCurrencyHandler)
	r.DELETE("/currency/:id", controller.RemoveCurrencyHandler)
	return r
}
