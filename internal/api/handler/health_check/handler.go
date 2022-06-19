package health_check

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
)

func Handler(c *gin.Context) {
	c.JSON(200, handler.MakeResponse("ok"))
	return
}
