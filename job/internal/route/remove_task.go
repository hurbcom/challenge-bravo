package route

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/robfig/cron/v3"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/middleware"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/scheduler"
)

// RemoveTask godoc
//
//	@Summary		Remove Task
//	@Description	remove a task from cron time scheduler.
//	@Tags			Tasks
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"task ID"
//	@Success		200	{object}	bool
//	@Failure		500	{object}	exception.InternalServerException
//	@Failure		400	{object}	exception.BadRequestException
//	@Failure		401	{object}	exception.UnauthorizedException
//	@Router			/tasks/{id} [delete]
//
//	@Security		Bearer
func handleRemoveTask(route *gin.RouterGroup) {
	removeTaskRoute := route.Group("")

	removeTaskRoute.Use(middleware.Jwt)

	removeTaskRoute.DELETE("tasks/:id", func(c *gin.Context) {
		idParam := c.Param("id")

		id, err := strconv.Atoi(idParam)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusBadRequest,
				"message": "id param is required and need to be a positive and integer number",
			})
			return
		}

		scheduler.New().RemoveTask(cron.EntryID(id))

		c.JSON(http.StatusOK, true)
	})
}
