package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type FindAllCurrencyHandler struct {
	useCase usecase.FindAllCurrencyUseCase
}

type FindAllCurrencyResponse struct {
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

func (h FindAllCurrencyResponse) MapToResponse(u []entity.Currency) []FindAllCurrencyResponse {
	res := []FindAllCurrencyResponse{}

	for _, v := range u {
		res = append(res, FindAllCurrencyResponse{
			ID:              v.ID,
			CreatedAt:       v.CreatedAt,
			UpdatedAt:       v.UpdatedAt,
			CreatedBy:       v.CreatedBy,
			UpdatedBy:       v.UpdatedBy,
			CountryCode:     v.CountryCode,
			Number:          v.Number,
			SearchURL:       v.SearchURL,
			Fic:             v.Fic,
			Country:         v.Country,
			Name:            v.Name,
			Code:            v.Code,
			USDExchangeRate: v.USDExchangeRate,
		})
	}

	return res
}

// FindAllCurrencies godoc
//
//	@Summary		Find All Curriencies
//	@Description	find all currencies
//	@Tags			Currencies
//	@Accept			json
//	@Produce		json
//	@Success		200	{array}		FindAllCurrencyResponse
//	@Failure		500	{object}	exception.InternalServerException
//	@Router			/currency [get]
func (h FindAllCurrencyHandler) Execute(c *gin.Context) {
	currency := h.useCase.Execute(c)

	res := FindAllCurrencyResponse{}

	c.JSON(http.StatusOK, res.MapToResponse(currency))
}

func NewFindAllCurrencyHandler(useCase usecase.FindAllCurrencyUseCase) FindAllCurrencyHandler {
	return FindAllCurrencyHandler{
		useCase: useCase,
	}
}
