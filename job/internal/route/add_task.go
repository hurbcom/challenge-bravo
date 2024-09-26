package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/task"
)

type AddTaskRequest struct {
	Name string `json:"name"`
}

// AddTask godoc
//
//	@Summary		Add Task
//	@Description	Add a task to cron scheduler
//	@Tags			Tasks
//	@Accept			json
//	@Produce		json
//	@Param			task	body		AddTaskRequest	true	"new task"
//	@Success		200		{object}	bool
//	@Failure		500		{object}	exception.InternalServerException
//	@Failure		400		{object}	exception.BadRequestException
//	@Failure		401		{object}	exception.UnauthorizedException
//	@Router			/tasks [post]
//
//	@Security		Bearer
func handleAddTask(router *gin.RouterGroup) {
	addTaskRoute := router.Group("")

	addTaskRoute.Use(middleware.Jwt)

	addTaskRoute.POST("tasks", func(c *gin.Context) {
		body := AddTaskRequest{}

		err := c.ShouldBindJSON(&body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    http.StatusBadRequest,
				"message": err.Error(),
			})
			return
		}

		if body.Name == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    http.StatusBadRequest,
				"message": "task name is required",
			})
			return

		}

		switch body.Name {
		case enum.CurrencyUpdaterTask:
			task.NewCurrencyUpdater().AddToScheduler()
		default:
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    http.StatusBadRequest,
				"message": "task not available",
			})
			return
		}

		c.JSON(http.StatusOK, true)
	})
}
