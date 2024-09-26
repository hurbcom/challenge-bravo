package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/scheduler"
)

// ListAvailableTasks godoc
//
//	@Summary		List Available Tasks
//	@Description	List available tasks that you can run immediatelly or put in cron scheuler.
//	@Tags			Tasks
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	scheduler.AvailableTask
//	@Failure		500	{object}	exception.InternalServerException
//	@Failure		400	{object}	exception.BadRequestException
//	@Failure		401	{object}	exception.UnauthorizedException
//	@Router			/available-tasks [get]
//
//	@Security		Bearer
func handleListAvailableTasks(router *gin.RouterGroup) {
	listAvailableTasksRoute := router.Group("")

	listAvailableTasksRoute.Use(middleware.Jwt)

	listAvailableTasksRoute.GET("available-tasks", func(c *gin.Context) {
		scheduler := scheduler.New()

		c.JSON(http.StatusOK, scheduler.GetAllAvailableTasks())
	})
}
