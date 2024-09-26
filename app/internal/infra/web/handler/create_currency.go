package handler

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/exception"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/usecase"
)

type CreateCurrencyHandler struct {
	useCase usecase.CreateCurrencyUseCase
}

type CreateCurrencyRequest struct {
	CountryCode        *string `json:"country_code,omitempty" example:"USA"`
	Number             *int    `json:"number,omitempty" example:"840"`
	SearchURL          *string `json:"search_url,omitempty" example:"http://usd-exchange.com"`
	ResponsePathToRate *string `json:"response_path_to_rate" example:"bpi;USD;rate_float"`
	Fic                *bool   `json:"fic,omitempty" example:"false"`
	Country            *string `json:"country,omitempty" example:"United States"`
	Name               string  `json:"name" example:"Dollar"`
	Code               string  `json:"code" example:"USD"`
	USDExchangeRate    float64 `json:"usd_exchange_rate" example:"1"`
}

type CreateCurrencyResponse struct {
	ID                 int       `json:"id" example:"1"`
	CreatedAt          time.Time `json:"created_at" example:"2024-09-05 02:28:41.425 -0300"`
	UpdatedAt          time.Time `json:"updated_at" example:"2024-09-05 02:28:41.425 -0300"`
	CreatedBy          int       `json:"created_by" example:"1"`
	UpdatedBy          int       `json:"updated_by" example:"1"`
	CountryCode        *string   `json:"country_code" example:"USA"`
	Number             *int      `json:"number" example:"840"`
	SearchURL          *string   `json:"search_url" example:"http://usd-exchange.com"`
	Fic                *bool     `json:"fic" example:"false"`
	ResponsePathToRate *string   `json:"response_path_to_rate" example:"bpi;USD;rate_float"`
	Country            *string   `json:"country" example:"United States"`
	Name               string    `json:"name" example:"Dollar"`
	Code               string    `json:"code" example:"USD"`
	USDExchangeRate    float64   `json:"usd_exchange_rate" example:"1"`
}

func (c CreateCurrencyRequest) MapToDomain() entity.Currency {
	return entity.Currency{
		CountryCode:        c.CountryCode,
		Number:             c.Number,
		SearchURL:          c.SearchURL,
		Fic:                c.Fic,
		Country:            c.Country,
		Name:               c.Name,
		Code:               c.Code,
		USDExchangeRate:    c.USDExchangeRate,
		ResponsePathToRate: c.ResponsePathToRate,
	}
}

func (h CreateCurrencyRequest) Valid() error {
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

func (h CreateCurrencyResponse) MapToResponse(u entity.Currency) CreateCurrencyResponse {
	return CreateCurrencyResponse{
		ID:                 u.ID,
		CreatedAt:          u.CreatedAt,
		UpdatedAt:          u.UpdatedAt,
		CreatedBy:          u.CreatedBy,
		UpdatedBy:          u.UpdatedBy,
		CountryCode:        u.CountryCode,
		Number:             u.Number,
		SearchURL:          u.SearchURL,
		Fic:                u.Fic,
		Country:            u.Country,
		Name:               u.Name,
		Code:               u.Code,
		USDExchangeRate:    u.USDExchangeRate,
		ResponsePathToRate: u.ResponsePathToRate,
	}
}

// CreateCurrency godoc
//
//	@Summary		Create Currency
//	@Description	create a currency
//	@Tags			Currencies
//	@Accept			json
//	@Produce		json
//	@Param			currency	body		CreateCurrencyRequest	true	"new currency"
//	@Success		201			{object}	CreateCurrencyResponse
//	@Failure		500			{object}	exception.InternalServerException
//	@Failure		400			{object}	exception.BadRequestException
//	@Failure		401			{object}	exception.UnauthorizedException
//	@Router			/currency [post]
//
//	@Security		Bearer
func (h CreateCurrencyHandler) Execute(c *gin.Context) {
	body := CreateCurrencyRequest{}

	readBody(c, &body)

	user := getUserClaims(c)

	err := body.Valid()

	if err != nil {
		panic(exception.BadRequest(err.Error()))
	}

	currency := h.useCase.Execute(c, body.MapToDomain(), user.ID)

	res := CreateCurrencyResponse{}

	c.JSON(http.StatusCreated, res.MapToResponse(currency))
}

func NewCreateCurrencyHandler(useCase usecase.CreateCurrencyUseCase) CreateCurrencyHandler {
	return CreateCurrencyHandler{
		useCase: useCase,
	}
}
