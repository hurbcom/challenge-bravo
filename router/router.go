package router

import (
	"fmt"
	"os"

	"github.com/gustavowiller/challengebravo/controllers"

	"github.com/gin-gonic/gin"
)

// Instance the router to handle request to our api
func Run() {
	router := gin.Default()

	router.POST("/currency", controllers.CreateCurrency)
	router.GET("/currency/convert/:from/:to/:amount", controllers.ConvertCurrency)
	router.DELETE("/currency/:code", controllers.DeleteCurrency)

	router.Run(fmt.Sprintf("%s:%s", os.Getenv("HTTP_HOST"), os.Getenv("HTTP_PORT")))
}
