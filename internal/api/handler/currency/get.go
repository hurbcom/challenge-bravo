package currency

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

func (h *Handler) GetByCode(c *gin.Context) {
	var code = c.Param("code")
	var result, err = h.domain.GetByCode(c, code)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err))
	}
	c.JSON(http.StatusOK, handler.MakeResponse(result))
	return
}

func (h *Handler) GetAll(c *gin.Context) {
	var result, err = h.domain.GetByFilter(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err))
	}
	c.JSON(http.StatusOK, handler.MakeResponse(result))
	return

}
