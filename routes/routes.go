package routes

import (
	"github.com/felipepnascimento/api-go-gin/controllers"
	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()
	r.GET("/currency", controllers.Index)
	r.POST("/currency", controllers.Create)
	r.GET("/currency/:id", controllers.Show)
	r.DELETE("/currency/:id", controllers.Delete)
	r.Run()
}
