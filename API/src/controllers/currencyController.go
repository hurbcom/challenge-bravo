package controllers

import (
	"api/src/config"
	"api/src/models"
	"api/src/repositories"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
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

	fromCurrency := strings.ToUpper(request.URL.Query().Get("from"))
	toCurrency := strings.ToUpper(request.URL.Query().Get("to"))
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 64)

	if amount <= 0 || err != nil {
		fmt.Printf(`\n error parsing amount from string to float.
		\n Amount: %0.2f 
		\n Error: %s`, amount, err)
		return
	}

	isFromCurrencyAllowed := repositories.IsAllowedCurrency(fromCurrency)
	isToCurrencyAllowed := repositories.IsAllowedCurrency(toCurrency)

	if !isFromCurrencyAllowed {
		fmt.Printf("\n currency %s not allowed \n", fromCurrency)
		return
	}

	if !isToCurrencyAllowed {
		fmt.Printf("\n currency %s not allowed \n", toCurrency)
		return
	}

	//TODO Choose a strategy to retrieve from database or external API
	// every 10 seconds
	fromCurrencyConversionRate := repositories.GetCurrencyConversionRateFromDatabase(fromCurrency)
	toCurrencyConversionRate := repositories.GetCurrencyConversionRateFromDatabase(toCurrency)

	conversionRate := toCurrencyConversionRate / fromCurrencyConversionRate

	valueConverted := amount * conversionRate

	fmt.Println("Converted Value:", valueConverted)
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

func GetCurrencyConversionRateFromDatabase(response http.ResponseWriter, request *http.Request) {
	parameters := mux.Vars(request)
	currencyName := parameters["name"]

	conversionRate := repositories.GetCurrencyConversionRateFromDatabase(currencyName)
	fmt.Println("Conversion Rate: ", conversionRate)
}

func InsertCurrency(response http.ResponseWriter, request *http.Request) {
}

func RemoveCurrency(response http.ResponseWriter, request *http.Request) {
}
