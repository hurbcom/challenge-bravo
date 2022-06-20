package currency

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"net/http"
)

// Update is the handler to update a currency
func (h *Handler) Update(c *gin.Context) {
	var currency models.Currency
	var err = c.ShouldBindJSON(&currency)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	h.domain.Models = &currency
	result, err := h.domain.UpdateCode(c, c.Param("code"))
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, handler.MakeResponse(result))
	return
}
