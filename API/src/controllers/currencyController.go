package controllers

import (
	"api/src/config"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
)

func InitRedisDatabase() {
	USDconversionRate := 1.0
	currency := models.Currency{Name: "USD", ConversionRate: USDconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	BRLconversionRate, _ := GetConversionRateBasedOnUSDFromAPI("USD", "BRL")
	currency = models.Currency{Name: "BRL", ConversionRate: BRLconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	EURconversionRate, _ := GetConversionRateBasedOnUSDFromAPI("USD", "EUR")
	currency = models.Currency{Name: "EUR", ConversionRate: EURconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	BTCconversionRate, _ := GetConversionRateBasedOnUSDFromAPI("USD", "BTC")
	currency = models.Currency{Name: "BTC", ConversionRate: BTCconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	ETHconversionRate, _ := GetConversionRateBasedOnUSDFromAPI("USD", "ETH")
	currency = models.Currency{Name: "ETH", ConversionRate: ETHconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)
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

	if fromCurrency.IsAutoUpdatable && !isUpdated(fromCurrency) {

		fromCurrency.ConversionRate, err = GetConversionRateBasedOnUSDFromAPI("USD", fromCurrency.Name)
		if err != nil {
			responses.Error(responseWriter, http.StatusInternalServerError, err)
			return
		}

		if err := updateCurrency(fromCurrency); err != nil {
			responses.Error(responseWriter, http.StatusInternalServerError, err)
			return
		}

	}

	if toCurrency.IsAutoUpdatable && !isUpdated(toCurrency) {

		toCurrency.ConversionRate, err = GetConversionRateBasedOnUSDFromAPI("USD", toCurrency.Name)
		if err != nil {
			responses.Error(responseWriter, http.StatusInternalServerError, err)
			return
		}

		if err := updateCurrency(toCurrency); err != nil {
			responses.Error(responseWriter, http.StatusInternalServerError, err)
			return
		}

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

func updateCurrency(currency models.Currency) error {
	currency.LastUpdated = time.Now()
	return repositories.InsertCurrency(currency)
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

func isUpdated(currency models.Currency) bool {
	return currency.LastUpdated.Add(time.Second * 11).After(time.Now())
}

func GetConversionRateBasedOnUSDFromAPI(fromCurrency string, toCurrency string) (float64, error) {

	urlToExternalAPI :=
		config.UrlToExternalAPI + "?fsym=" + fromCurrency + `&tsyms=` + toCurrency + "," + fromCurrency

	currencyAPIResponse, err := http.Get(urlToExternalAPI)

	if err != nil {
		fmt.Println("error trying to call external API:", err)
		return 0, err
	}

	responseData, err := io.ReadAll(currencyAPIResponse.Body)

	if err != nil {
		fmt.Println("error trying to read response data:", err)
		return 0, err
	}

	var mapAPIResponse map[string]float64

	if err = json.Unmarshal(responseData, &mapAPIResponse); err != nil {
		fmt.Println("error trying to Unmarshal response data:", err)
		return 0, err
	}

	fromCurrencyConverted := mapAPIResponse[fromCurrency]
	toCurrencyConverted := mapAPIResponse[toCurrency]

	conversionRate := toCurrencyConverted / fromCurrencyConverted

	return conversionRate, nil
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

	currency.LastUpdated = time.Now()
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
