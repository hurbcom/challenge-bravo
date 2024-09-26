package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/task"
)

type RunTaskRequest struct {
	Name string `json:"name" example:"Currency Updater"`
}

// RunTask godoc
//
//	@Summary		Run Task
//	@Description	You can run a task informing tha name, get this name in "List available tasks" endpoint
//	@Tags			Tasks
//	@Accept			json
//	@Produce		json
//	@Param			task	body		RunTaskRequest	true	"task"
//	@Success		200		{object}	bool
//	@Failure		500		{object}	exception.InternalServerException
//	@Failure		400		{object}	exception.BadRequestException
//	@Failure		401		{object}	exception.UnauthorizedException
//	@Router			/tasks/run [post]
//
//	@Security		Bearer
func handleRunTask(router *gin.RouterGroup) {
	runTaskRoute := router.Group("")

	runTaskRoute.Use(middleware.Jwt)

	runTaskRoute.POST("tasks/run", func(c *gin.Context) {
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
			if err := task.NewCurrencyUpdater().Run(c); err != nil {

				c.JSON(http.StatusBadRequest, gin.H{
					"code":    http.StatusBadRequest,
					"message": err.Error(),
				})
				return

			}
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
