package currency

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
	"net/http"
)

func (h *Handler) Delete(c *gin.Context) {
	var code = c.Param("code")
	var err = h.domain.Delete(c, code)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, handler.MakeResponse("OK"))
	return
}
