package router

import (
	"github.com/gustavowiller/challengebravo/controllers"

	"github.com/gin-gonic/gin"
)

func Run() {
	router := gin.Default()

	router.POST("/currency", controllers.CreateCurrency)
	router.GET("/currency/convert/:from/:to/:amount", controllers.ConvertCurrency)
	router.DELETE("/currency/:code", controllers.DeleteCurrency)

	router.Run("localhost:8080")
}
