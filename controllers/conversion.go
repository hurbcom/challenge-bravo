package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type conversionController struct {
	conversionUsecase   usecases.ConversionUsecase
	currencyUsecase     usecases.CurrencyUsecase
	exchangeRateUsecase usecases.ExchangeRateUsecase
}

type ConversionController interface {
	Convert(c *gin.Context)
}

func InitializeConversionController(conversionUsecase usecases.ConversionUsecase, currencyUsecase usecases.CurrencyUsecase, exchangeRateUsecase usecases.ExchangeRateUsecase) ConversionController {
	return &conversionController{conversionUsecase, currencyUsecase, exchangeRateUsecase}
}

func (controller *conversionController) Convert(c *gin.Context) {
	from, to, amount := GetConvertParams(c)

	err := ValidateConvertParams(from, to, amount)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Bad Request": err.Error()})
		return
	}

	fromCurrency, _ := controller.currencyUsecase.GetCurrencyByKey(from)
	toCurrency, _ := controller.currencyUsecase.GetCurrencyByKey(to)

	err = ValidateCurrencies(fromCurrency, toCurrency)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Bad Request": err.Error()})
		return
	}

	rate, err := controller.exchangeRateUsecase.GetCurrencyRate(fromCurrency, toCurrency)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": err.Error()})
		return
	}

	conversion := models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * rate,
	}
	err = controller.conversionUsecase.CreateConversion(&conversion)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, conversion)
}

func GetConvertParams(c *gin.Context) (string, string, float32) {
	from := c.Query("from")
	to := c.Query("to")
	a, _ := strconv.ParseFloat(c.Query("amount"), 32)
	amount := float32(a)

	return from, to, amount
}

func ValidateConvertParams(from string, to string, amount float32) error {
	if from == "" {
		return errors.New("From parameter is required")
	}

	if to == "" {
		return errors.New("To parameter is required")
	}

	if amount == 0 {
		return errors.New("Amount parameter is required")
	}

	return nil
}

func ValidateCurrencies(fromCurrency *models.Currency, toCurrency *models.Currency) error {
	if fromCurrency == nil {
		return errors.New("From currency does not exists or is not available to conversion")
	}

	if toCurrency == nil {
		return errors.New("To currency does not exists or is not available to conversion")
	}

	return nil
}
