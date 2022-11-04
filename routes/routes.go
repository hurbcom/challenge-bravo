package routes

import (
	"github.com/felipepnascimento/api-go-gin/controllers"
	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()
	r.GET("api/currency", controllers.ListCurrencies)
	r.POST("api/currency", controllers.CreateCurrency)
	r.GET("api/currency/:id", controllers.ShowCurrency)
	r.DELETE("api/currency/:id", controllers.DeleteCurrency)

	r.GET("api/conversion", controllers.Convert)

	r.Run()
}
