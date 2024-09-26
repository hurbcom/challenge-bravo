package handler

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type UpdateCurrencyHandler struct {
	useCase usecase.UpdateCurrencyUseCase
}

type UpdateCurrencyRequest struct {
	CountryCode     *string `json:"country_code,omitempty" example:"USA"`
	Number          *int    `json:"number,omitempty" example:"840"`
	SearchURL       *string `json:"search_url,omitempty" example:"http://usd-exchange.com"`
	Fic             *bool   `json:"fic,omitempty" example:"false"`
	Country         *string `json:"country,omitempty" example:"United States"`
	Name            string  `json:"name" example:"Dollar"`
	Code            string  `json:"code" example:"USD"`
	USDExchangeRate float64 `json:"usd_exchange_rate" example:"1"`
}

func (c UpdateCurrencyRequest) MapToDomain() entity.Currency {
	return entity.Currency{
		CountryCode:     c.CountryCode,
		Number:          c.Number,
		SearchURL:       c.SearchURL,
		Fic:             c.Fic,
		Country:         c.Country,
		Name:            c.Name,
		Code:            c.Code,
		USDExchangeRate: c.USDExchangeRate,
	}
}

func (h UpdateCurrencyRequest) Valid() error {
	reqErrors := []string{}

	if h.Name == "" {
		reqErrors = append(reqErrors, "name is required")
	}

	if h.Code == "" {
		reqErrors = append(reqErrors, "code is required")
	}
	if h.USDExchangeRate == 0 {
		reqErrors = append(reqErrors, "usd_exchange_rate is required")
	}

	if len(reqErrors) > 0 {
		return errors.New(strings.Join(reqErrors, ", "))
	}

	return nil
}

// UpdateCurrency godoc
//
//	@Summary		Update Currency
//	@Description	update currency informing the id
//	@Tags			Currencies
//	@Accept			json
//	@Produce		json
//	@Param			newCurrency	body		UpdateCurrencyRequest	true	"new currency data"
//	@Success		200			{object}	bool
//	@Failure		500			{object}	exception.InternalServerException
//	@Failure		401			{object}	exception.UnauthorizedException
//	@Router			/currency/{id} [put]
//
//	@Security		Bearer
func (h UpdateCurrencyHandler) Execute(c *gin.Context) {
	body := UpdateCurrencyRequest{}

	id := getIdFromReq(c)

	readBody(c, &body)

	user := getUserClaims(c)

	err := body.Valid()

	if err != nil {
		panic(exception.BadRequest(err.Error()))
	}

	h.useCase.Execute(c, body.MapToDomain(), id, user.ID)

	c.JSON(http.StatusOK, true)
}

func NewUpdateCurrencyHandler(useCase usecase.UpdateCurrencyUseCase) UpdateCurrencyHandler {
	return UpdateCurrencyHandler{
		useCase: useCase,
	}
}
