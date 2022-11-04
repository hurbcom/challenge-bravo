package routes

import (
	"github.com/felipepnascimento/api-go-gin/controllers"
	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()
	r.GET("/api/currency", controllers.Convert)
	r.Run()
}
