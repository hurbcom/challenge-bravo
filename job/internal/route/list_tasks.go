package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/scheduler"
)

// ListTasks godoc
//
//	@Summary		List Tasks
//	@Description	List running tasks in cron scheduler
//	@Tags			Tasks
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	scheduler.Task{id=int}	"desc"
//	@Failure		500	{object}	exception.InternalServerException
//	@Failure		400	{object}	exception.BadRequestException
//	@Failure		401	{object}	exception.UnauthorizedException
//	@Router			/tasks [get]
//
//	@Security		Bearer
func handleListTasks(router *gin.RouterGroup) {
	listTaskRoute := router.Group("")

	listTaskRoute.Use(middleware.Jwt)

	listTaskRoute.GET("tasks", func(c *gin.Context) {
		scheduler := scheduler.New()

		c.JSON(http.StatusOK, scheduler.GetAllTasks())
	})
}
