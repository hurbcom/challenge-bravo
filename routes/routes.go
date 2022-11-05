package routes

import (
	"github.com/felipepnascimento/challenge-bravo-flp/controllers"
	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()
	r.GET("currency", controllers.ListCurrencies)
	r.POST("currency", controllers.CreateCurrency)
	r.GET("currency/:id", controllers.ShowCurrency)

	r.GET("conversion", controllers.Convert)

	r.Run()
}
