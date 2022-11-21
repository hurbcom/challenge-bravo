package controllers

import (
	"challenge-bravo/src/models"
	"challenge-bravo/src/responses"
	"net/http"
	"strconv"
	"strings"
)

type ConversionService interface {
	ConvertCurrency(string, string, float64) (models.ConversionResponse, error)
}

type ConversionController struct {
	service ConversionService
}

func NewConversionController(service ConversionService) *ConversionController {
	return &ConversionController{service}
}

func (conversionController ConversionController) ConvertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	fromCurrencyParam := strings.ToUpper(request.URL.Query().Get("from"))
	toCurrencyParam := strings.ToUpper(request.URL.Query().Get("to"))
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 64)

	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if amount <= 0 {
		responses.JSON(responseWriter, http.StatusBadRequest, "Amount must be greater than 0.")
		return
	}

	conversionResponse, err := conversionController.service.ConvertCurrency(fromCurrencyParam, toCurrencyParam, amount)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, conversionResponse)
}
