package handlers

import (
	"fmt"
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

	currencys, err := handler.currencyUsecase.GetAllCurrencies()
	if err == nil {
		result.StatusCode = http.StatusOK
		result.Message = "Success to get all currencys"
		if len(*currencys) == 0 {
			result.Data = []struct{}{}
		} else {
			result.Data = currencys
		}
	} else {
		result.StatusCode = http.StatusInternalServerError
		result.Err = err
		result.Data = []struct{}{}
	}

	return &result
}

func (handler *currencyHandler) GetCurrencyByID(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult
	id, err := strconv.Atoi(ctx.Param("id"))

	currency, err := handler.currencyUsecase.GetCurrencyByID(id)
	if err == nil {
		result.StatusCode = http.StatusOK
		result.Message = fmt.Sprintf("Success to get currency with id %d", id)
		if currency == nil {
			result.Data = struct{}{}
		} else {
			result.Data = currency
		}
	} else {
		fmt.Println()
		result.StatusCode = err.(*entities.AppError).StatusCode
		result.Err = err.(*entities.AppError).Err
		result.Data = struct{}{}
	}

	return &result
}

func (handler *currencyHandler) CreateCurrency(ctx *gin.Context) *entities.AppResult {
	var currency entities.Currency
	var result entities.AppResult

	if err := ctx.ShouldBindJSON(&currency); err != nil {
		result.Err = err
		result.Message = "username and text can not be empty"
		result.StatusCode = http.StatusBadRequest
		return &result
	}

	err := handler.currencyUsecase.CreateCurrency(&currency)
	if err == nil {
		result.Message = "Success to create currency"
		result.StatusCode = http.StatusCreated
	} else {
		result.Err = err.(*entities.AppError).Err
		result.Message = err.(*entities.AppError).Error()
		result.StatusCode = err.(*entities.AppError).StatusCode
	}

	return &result
}

func (handler *currencyHandler) DeleteCurrency(ctx *gin.Context) *entities.AppResult {
	var result entities.AppResult

	id, err := strconv.Atoi(ctx.Param("id"))

	err = handler.currencyUsecase.DeleteCurrency(id)
	if err == nil {
		result.Message = fmt.Sprintf("Success to delete currency with id %d", id)
		result.StatusCode = http.StatusAccepted
	} else {
		result.Err = err.(*entities.AppError).Err
		result.Message = err.(*entities.AppError).Error()
		result.StatusCode = err.(*entities.AppError).StatusCode
	}

	return &result
}
