package currency

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
	"net/http"
)

// Create handles the creation of a new currency
func (h *Handler) Create(c *gin.Context) {
	// get the currency data from the request
	var err = c.ShouldBindJSON(h.domain.Models)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse("invalid json"))
		return
	}
	// validate the fields of the currency
	erros := h.domain.Models.Validate()
	if erros != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(erros))
		return
	}
	// create the currency
	result, err := h.domain.Create(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	// handle if the currency has been created before
	if result == nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(
			fmt.Sprintf("already exists currency with code %s",
				h.domain.Models.Code)))
		return
	}
	// return the currency created if everything is ok
	c.JSON(http.StatusCreated, handler.MakeResponse(h.domain.Models))
	return
}
