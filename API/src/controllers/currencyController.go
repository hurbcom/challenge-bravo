package controllers

import (
	"api/src/config"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-redis/redis"
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

		repositories.InsertCurrency(currency)
	}

}

func UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")
	currencies, err := repositories.GetAllUpdatableCurrencies()
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

		if err := repositories.UpdateCurrency(newCurrency); err != nil {
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

	isFromCurrencyAllowed, err := IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if !isFromCurrencyAllowed {
		message := fmt.Sprintf("currency %s not allowed", fromCurrencyParam)
		responses.JSON(responseWriter, http.StatusBadRequest, message)
		return
	}

	isToCurrencyAllowed, err := IsAllowedCurrency(toCurrencyParam)
	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	if !isToCurrencyAllowed {
		message := fmt.Sprintf("currency %s not allowed", toCurrencyParam)
		responses.JSON(responseWriter, http.StatusBadRequest, message)
		return
	}

	var fromCurrency, toCurrency models.Currency

	fromCurrency, err = getCurrencyFromDatabase(fromCurrencyParam)
	if err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", toCurrencyParam)
		responses.Error(responseWriter, http.StatusNotFound, err)
	}

	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	toCurrency, err = getCurrencyFromDatabase(toCurrencyParam)
	if err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", toCurrencyParam)
		responses.Error(responseWriter, http.StatusNotFound, err)
	}

	if err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
		return
	}

	conversionRate := toCurrency.ConversionRate / fromCurrency.ConversionRate

	convertedValue := amount * conversionRate

	conversionResponse := models.ConversionResponse{
		FromCurrency:   fromCurrencyParam,
		ToCurrency:     toCurrencyParam,
		Amount:         amount,
		ConvertedValue: convertedValue,
	}
	responses.JSON(responseWriter, http.StatusOK, conversionResponse)
}

func IsAllowedCurrency(currencyName string) (bool, error) {

	_, err := repositories.GetCurrencyByName(currencyName)

	if err == redis.Nil {
		err = nil
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
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

func getCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	var currency models.Currency

	currency, err := repositories.GetCurrencyByName(currencyName)

	if currency == (models.Currency{}) && err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", currencyName)
		return models.Currency{}, err
	}

	if err != nil {
		return models.Currency{}, err
	}

	return currency, nil
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

	currency.Name = strings.ToUpper(currency.Name)

	if err = repositories.InsertCurrency(currency); err != nil {
		responses.Error(responseWriter, http.StatusInternalServerError, err)
	}

	responses.JSON(responseWriter, http.StatusCreated, currency)
}

func DeleteCurrency(responseWriter http.ResponseWriter, request *http.Request) {
	parameters := mux.Vars(request)

	currencyNameParam := parameters["name"]

	if repositories.DeleteCurrency(currencyNameParam).Val() == 0 {
		err := fmt.Errorf("no key %s found to be deleted", currencyNameParam)
		responses.Error(responseWriter, http.StatusNotFound, err)
	}
}
