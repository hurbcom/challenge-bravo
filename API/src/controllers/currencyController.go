package controllers

import (
	"api/src/models"
	"api/src/responses"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

type CurrencyService interface {
	UpdateAllUpdatableCurrencies()
	GetCurrenciesBasedOnUSDFromAPI(string, []string) ([]models.ConversionRateFromAPI, error)
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	UpdateCurrency(models.Currency) error
	ConvertCurrency(string, string, float64) (models.ConversionResponse, error)
	InsertCurrency(models.Currency) error
	DeleteCurrency(string) error
	GetAllCurrencies() ([]models.Currency, error)
}

type CurrencyController struct {
	service CurrencyService
}

func NewCurrencyController(service CurrencyService) *CurrencyController {
	return &CurrencyController{service}
}

func (currencyController CurrencyController) DatabaseSeed() {

	conversionRatesByCurrency, err := currencyController.service.GetCurrenciesBasedOnUSDFromAPI("USD",
		[]string{"BRL", "EUR", "BTC", "ETH", "USD"})

	if err != nil {
		log.Fatal(err)
	}

	for _, conversionRateByCurrency := range conversionRatesByCurrency {

		currency := models.Currency{
			Name:            conversionRateByCurrency.Name,
			ConversionRate:  conversionRateByCurrency.ConversionRate,
			IsAutoUpdatable: true}

		currencyController.service.InsertCurrency(currency)
	}
}

func (currencyController CurrencyController) GetAllCurrencies(responseWriter http.ResponseWriter, request *http.Request) {

	allCurrencies, err := currencyController.service.GetAllCurrencies()
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, allCurrencies)
}

func (currencyController CurrencyController) UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")
	currencyController.service.UpdateAllUpdatableCurrencies()
}

func (currencyController CurrencyController) ConvertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

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

	conversionResponse, err := currencyController.service.ConvertCurrency(fromCurrencyParam, toCurrencyParam, amount)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, conversionResponse)
}

func (currencyController CurrencyController) InsertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	requestBody, err := io.ReadAll(request.Body)
	if err != nil {
		fmt.Println("error trying to read from request body: ", err)
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	var currency models.Currency

	if err = json.Unmarshal(requestBody, &currency); err != nil {
		fmt.Println("error trying to Unmarshal request body: ", err)
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if err = currencyController.service.InsertCurrency(currency); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusCreated, currency)
}

func (currencyController CurrencyController) DeleteCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	parameters := mux.Vars(request)
	currencyNameParam := parameters["name"]

	if err := currencyController.service.DeleteCurrency(currencyNameParam); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, nil)
}
