package controllers

import (
	"api/src/config"
	"api/src/models"
	"api/src/repositories"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis"
)

func InitRedisDatabase() {
	USDconversionRate := 1.0
	currency := models.Currency{Name: "USD", ConversionRate: USDconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	BRLconversionRate := GetConversionRateBasedOnUSDFromAPI("USD", "BRL")
	currency = models.Currency{Name: "BRL", ConversionRate: BRLconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	EURconversionRate := GetConversionRateBasedOnUSDFromAPI("USD", "EUR")
	currency = models.Currency{Name: "EUR", ConversionRate: EURconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	BTCconversionRate := GetConversionRateBasedOnUSDFromAPI("USD", "BTC")
	currency = models.Currency{Name: "BTC", ConversionRate: BTCconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)

	ETHconversionRate := GetConversionRateBasedOnUSDFromAPI("USD", "ETH")
	currency = models.Currency{Name: "ETH", ConversionRate: ETHconversionRate,
		LastUpdated: time.Now()}
	repositories.InsertCurrency(currency)
}

func ConvertCurrency(response http.ResponseWriter, request *http.Request) /*float64*/ {

	fromCurrencyParam := strings.ToUpper(request.URL.Query().Get("from"))
	toCurrencyParam := strings.ToUpper(request.URL.Query().Get("to"))
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 64)

	if amount <= 0 || err != nil {
		fmt.Printf(`\n error parsing amount from string to float.
		\n Amount: %0.2f 
		\n Error: %s`, amount, err)
		return
	}

	if !IsAllowedCurrency(fromCurrencyParam) {
		fmt.Printf("\n currency %s not allowed \n", fromCurrencyParam)
		return
	}

	if !IsAllowedCurrency(toCurrencyParam) {
		fmt.Printf("\n currency %s not allowed \n", toCurrencyParam)
		return
	}

	var fromCurrency, toCurrency models.Currency

	fromCurrency = getCurrencyFromDatabase(fromCurrencyParam)
	toCurrency = getCurrencyFromDatabase(toCurrencyParam)

	//TODO Don't update currencies that do not exist in the API
	if !isUpdated(fromCurrency) {
		fromCurrency.ConversionRate = GetConversionRateBasedOnUSDFromAPI("USD", fromCurrency.Name)
		updateCurrency(fromCurrency)
	}

	if !isUpdated(toCurrency) {
		toCurrency.ConversionRate = GetConversionRateBasedOnUSDFromAPI("USD", toCurrency.Name)
		updateCurrency(toCurrency)
	}

	conversionRate := toCurrency.ConversionRate / fromCurrency.ConversionRate

	valueConverted := amount * conversionRate

	fmt.Println("Converted Value:", valueConverted)
}

func updateCurrency(currency models.Currency) {
	currency.LastUpdated = time.Now()
	repositories.InsertCurrency(currency)
}

func IsAllowedCurrency(currencyName string) bool {

	_, err := repositories.GetCurrencyByName(currencyName)

	if err == redis.Nil {
		return false
	}

	return true
}

func isUpdated(currency models.Currency) bool {
	return currency.LastUpdated.Add(time.Second * 11).After(time.Now())
}

func GetConversionRateBasedOnUSDFromAPI(fromCurrency string, toCurrency string) float64 {

	urlToExternalAPI :=
		config.UrlToExternalAPI + "?fsym=" + fromCurrency + `&tsyms=` + toCurrency + "," + fromCurrency

	currencyAPIResponse, err := http.Get(urlToExternalAPI)

	if err != nil {
		fmt.Printf("\n error trying to call external API: %s", err)
		return 0
	}

	responseData, err := io.ReadAll(currencyAPIResponse.Body)

	if err != nil {
		fmt.Printf("\n error trying to read response data: %s", err)
		return 0
	}

	var mapAPIResponse map[string]float64

	json.Unmarshal(responseData, &mapAPIResponse)

	fromCurrencyConverted := mapAPIResponse[fromCurrency]
	toCurrencyConverted := mapAPIResponse[toCurrency]

	conversionRate := toCurrencyConverted / fromCurrencyConverted

	return conversionRate
}

func getCurrencyFromDatabase(currencyName string) models.Currency {

	var currency models.Currency

	currency, err := repositories.GetCurrencyByName(currencyName)
	if err != nil {
		log.Fatal(err)
	}

	return currency
}

func InsertCurrency(response http.ResponseWriter, request *http.Request) {
}

func RemoveCurrency(response http.ResponseWriter, request *http.Request) {
}
