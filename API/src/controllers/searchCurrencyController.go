package controllers

import (
	"api/src/models"
	"api/src/responses"
	"net/http"
)

type CurrencyService interface {
	GetCurrenciesBasedOnUSDFromAPI(string, []string) ([]models.ConversionRateFromAPI, error)
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	GetAllCurrencies() ([]models.Currency, error)
}

type CurrencyController struct {
	service CurrencyService
}

func NewCurrencyController(service CurrencyService) *CurrencyController {
	return &CurrencyController{service}
}

func (currencyController CurrencyController) GetAllCurrencies(responseWriter http.ResponseWriter, request *http.Request) {

	allCurrencies, err := currencyController.service.GetAllCurrencies()
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, allCurrencies)
}

func (currencyController CurrencyController) GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {
	return currencyController.service.GetCurrenciesBasedOnUSDFromAPI(fromCurrency, toCurrencies)
}
