package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type DeleteCurrencyHandler struct {
	useCase usecase.DeleteCurrencyUseCase
}

// DeleteCurrency godoc
//
//	@Summary		Delete Currency
//	@Description	delete a currency
//	@Tags			Currencies
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"currency id"
//	@Success		200	{object}	bool
//	@Failure		500	{object}	exception.InternalServerException
//	@Failure		401	{object}	exception.UnauthorizedException
//	@Router			/currency/{id} [delete]
//
//	@Security		Bearer
func (h DeleteCurrencyHandler) Execute(c *gin.Context) {
	id := getIdFromReq(c)

	h.useCase.Execute(c, id)

	c.JSON(http.StatusOK, true)
}

func NewDeleteCurrencyHandler(useCase usecase.DeleteCurrencyUseCase) DeleteCurrencyHandler {
	return DeleteCurrencyHandler{
		useCase: useCase,
	}
}
