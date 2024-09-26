package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type FindCurrencyByCodeHandler struct {
	useCase usecase.FindCurrencyByCodeUseCase
}

type FindCurrencyByCodeResponse struct {
	ID              int       `json:"id" example:"1"`
	CreatedAt       time.Time `json:"created_at" example:"2024-09-05 02:28:41.425 -0300"`
	UpdatedAt       time.Time `json:"updated_at" example:"2024-09-05 02:28:41.425 -0300"`
	CreatedBy       int       `json:"created_by" example:"1"`
	UpdatedBy       int       `json:"updated_by" example:"1"`
	CountryCode     *string   `json:"country_code" example:"USA"`
	Number          *int      `json:"number" example:"840"`
	SearchURL       *string   `json:"search_url" example:"http://usd-exchange.com"`
	Fic             *bool     `json:"fic" example:"false"`
	Country         *string   `json:"country" example:"United States"`
	Name            string    `json:"name" example:"Dollar"`
	Code            string    `json:"code" example:"USD"`
	USDExchangeRate float64   `json:"usd_exchange_rate" example:"1"`
}

func (h FindCurrencyByCodeResponse) MapToResponse(u entity.Currency) FindCurrencyByCodeResponse {
	return FindCurrencyByCodeResponse{
		ID:              u.ID,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
		CreatedBy:       u.CreatedBy,
		UpdatedBy:       u.UpdatedBy,
		CountryCode:     u.CountryCode,
		Number:          u.Number,
		SearchURL:       u.SearchURL,
		Fic:             u.Fic,
		Country:         u.Country,
		Name:            u.Name,
		Code:            u.Code,
		USDExchangeRate: u.USDExchangeRate,
	}
}

// FindCurrencyByCode godoc
//
//	@Summary		Find Currency By Code
//	@Description	find currency by code
//	@Tags			Currencies
//	@Accept			json
//	@Produce		json
//	@Param			code	path		string	true	"currency code"
//	@Success		200		{object}	FindCurrencyByCodeResponse
//	@Failure		500		{object}	exception.InternalServerException
//	@Failure		401		{object}	exception.UnauthorizedException
//	@Router			/currency/code/{code} [get]
//
//	@Security		Bearer
func (h FindCurrencyByCodeHandler) Execute(c *gin.Context) {
	code := getParamAsString(c, "code")

	currency := h.useCase.Execute(c, code)

	res := FindCurrencyByCodeResponse{}

	c.JSON(http.StatusOK, res.MapToResponse(*currency))
}

func NewFindCurrencyByCodeHandler(useCase usecase.FindCurrencyByCodeUseCase) FindCurrencyByCodeHandler {
	return FindCurrencyByCodeHandler{
		useCase: useCase,
	}
}
