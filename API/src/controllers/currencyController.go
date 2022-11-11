package controllers

import (
	"api/src/config"
	"api/src/models"
	"api/src/responses"
	"api/src/services"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

func InitRedisDatabase() {

	conversionRatesByCurrency, err := GetCurrenciesBasedOnUSDFromAPI("USD",
		[]string{"BRL", "EUR", "BTC", "ETH", "USD"})

	if err != nil {
		log.Fatal(err)
	}

	for _, conversionRateByCurrency := range conversionRatesByCurrency {

		currency := models.Currency{
			Name:            conversionRateByCurrency.Name,
			ConversionRate:  conversionRateByCurrency.ConversionRate,
			IsAutoUpdatable: true}

		services.InsertCurrency(currency)
	}
}

func GetAllCurrencies(responseWriter http.ResponseWriter, request *http.Request) {

	allCurrencies, err := services.GetAllCurrencies()
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, allCurrencies)
}

func UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")

	currencies, err := services.GetAllUpdatableCurrencies()
	if err != nil {
		log.Fatal(err)
	}

	var currencyNames []string
	for _, currency := range currencies {
		currencyNames = append(currencyNames, currency.Name)
	}

	conversionRatesByCurrency, err := GetCurrenciesBasedOnUSDFromAPI("USD",
		currencyNames)
	if err != nil {
		log.Fatal(err)
	}

	for _, newConversionRate := range conversionRatesByCurrency {

		newCurrency := models.Currency{
			Name:            newConversionRate.Name,
			ConversionRate:  newConversionRate.ConversionRate,
			IsAutoUpdatable: true,
		}

		if err := services.UpdateCurrency(newCurrency); err != nil {
			log.Fatal(err)
		}
	}
}

func ConvertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

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

	isFromCurrencyAllowed, err := services.IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if !isFromCurrencyAllowed {
		message := fmt.Sprintf("currency %s not allowed", fromCurrencyParam)
		responses.JSON(responseWriter, http.StatusBadRequest, message)
		return
	}

	isToCurrencyAllowed, err := services.IsAllowedCurrency(toCurrencyParam)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if !isToCurrencyAllowed {
		message := fmt.Sprintf("currency %s not allowed", toCurrencyParam)
		responses.JSON(responseWriter, http.StatusBadRequest, message)
		return
	}

	conversionResponse, err := services.ConvertCurrency(fromCurrencyParam, toCurrencyParam, amount)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, conversionResponse)
}

func GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {

	urlToExternalAPI := config.UrlToExternalAPI + "?fsym=" + fromCurrency + `&tsyms=` + fromCurrency

	for _, toCurrency := range toCurrencies {
		urlToExternalAPI += "," + toCurrency
	}

	currencyAPIResponse, err := http.Get(urlToExternalAPI)

	if err != nil {
		fmt.Println("error trying to call external API:", err)
		return nil, err
	}

	responseData, err := io.ReadAll(currencyAPIResponse.Body)

	if err != nil {
		fmt.Println("error trying to read response data:", err)
		return nil, err
	}

	var mapAPIResponse map[string]float64

	if err = json.Unmarshal(responseData, &mapAPIResponse); err != nil {
		fmt.Println("error trying to Unmarshal response data:", err)
		return nil, err
	}

	var conversionRatesFromAPI []models.ConversionRateFromAPI

	for _, toCurrency := range toCurrencies {
		conversionRate := mapAPIResponse[toCurrency] / mapAPIResponse[fromCurrency]
		conversionRatesFromAPI = append(conversionRatesFromAPI, models.ConversionRateFromAPI{
			Name:           toCurrency,
			ConversionRate: conversionRate,
		})
	}

	return conversionRatesFromAPI, nil
}

func InsertCurrency(responseWriter http.ResponseWriter, request *http.Request) {

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

	if err = services.InsertCurrency(currency); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusCreated, currency)
}

func DeleteCurrency(responseWriter http.ResponseWriter, request *http.Request) {

	parameters := mux.Vars(request)
	currencyNameParam := parameters["name"]

	if err := services.DeleteCurrency(currencyNameParam); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusOK, nil)
}
