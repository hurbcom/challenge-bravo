package handlers

import (
	"net/http"
	"strconv"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type currencyHandler struct {
	currencyUsecase usecases.CurrencyUsecase
}

type CurrencyHandler interface {
	GetAllCurrencies(ctx *gin.Context) *entities.AppResult
	GetCurrencyByID(ctx *gin.Context) *entities.AppResult
	CreateCurrency(ctx *gin.Context) *entities.AppResult
	DeleteCurrency(ctx *gin.Context) *entities.AppResult
}

func InitializeCurrencyHandler(usecase usecases.CurrencyUsecase) CurrencyHandler {
	return &currencyHandler{usecase}
}

func (handler *currencyHandler) GetAllCurrencies(*gin.Context) *entities.AppResult {
	var result entities.AppResult

	currencies, err := handler.currencyUsecase.GetAllCurrencies()
	if err != nil {
		result.StatusCode = http.StatusInternalServerError
		result.Err = err.(*entities.AppError).Err
	} else {
		result.StatusCode = http.StatusOK
		result.Data = currencies
	}

	return &result
}

func (handler *currencyHandler) GetCurrencyByID(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult
	id, err := strconv.Atoi(ctx.Param("id"))

	currency, err := handler.currencyUsecase.GetCurrencyByID(id)
	if err != nil {
		result.StatusCode = err.(*entities.AppError).StatusCode
		result.Err = err.(*entities.AppError).Err
	} else {
		result.StatusCode = http.StatusOK
		result.Data = currency
	}

	return &result
}

func (handler *currencyHandler) CreateCurrency(ctx *gin.Context) *entities.AppResult {
	var currency entities.Currency
	var result entities.AppResult

	if err := ctx.ShouldBindJSON(&currency); err != nil {
		result.Err = err.(*entities.AppError).Err
		result.StatusCode = http.StatusBadRequest
		return &result
	}

	err := handler.currencyUsecase.CreateCurrency(&currency)
	if err != nil {
		result.Err = err.(*entities.AppError).Err
		result.StatusCode = err.(*entities.AppError).StatusCode
	} else {
		result.Data = currency
		result.StatusCode = http.StatusOK
	}

	return &result
}

func (handler *currencyHandler) DeleteCurrency(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult

	id, err := strconv.Atoi(ctx.Param("id"))

	err = handler.currencyUsecase.DeleteCurrency(id)
	if err != nil {
		result.Err = err.(*entities.AppError).Err
		result.StatusCode = err.(*entities.AppError).StatusCode
	} else {
		result.StatusCode = http.StatusAccepted
	}

	return &result
}
