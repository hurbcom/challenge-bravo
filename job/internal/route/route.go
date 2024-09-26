package route

import (
	"github.com/gin-gonic/gin"
)

func Init() *gin.Engine {
	router := gin.New()
	v1 := router.Group("/v1")

	handleSwagger(v1)
	handleSignIn(v1)
	handleListTasks(v1)
	handleRemoveTask(v1)
	handleListAvailableTasks(v1)
	handleAddTask(v1)
	handleRunTask(v1)

	return router
}
