package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
)

func ConvertCurrency(response http.ResponseWriter, request *http.Request) /*float64*/ {
	fmt.Println("@ConvertCurrency")

	fromCurrency := strings.ToUpper(request.URL.Query().Get("from"))
	toCurrency := strings.ToUpper(request.URL.Query().Get("to"))
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 64)

	if amount <= 0 || err != nil {
		fmt.Printf(`\n error parsing amount from string to float.
		\n Amount: %0.2f 
		\n Error: %s`, amount, err)
		return
	}

	//TODO - VERIFY IF FROM AND TO CURRENCIES ARE ALLOWED BY THE API BEFORE CONSUMING EXTERNAL

	conversionRate := getConversionRateFromUSD(fromCurrency, toCurrency)

	valueConverted := amount * conversionRate

	fmt.Println("Converted Value:", valueConverted)

}

func getConversionRateFromUSD(fromCurrency string, toCurrency string) float64 {

	// TODO put this url into config.go
	urlToExternalAPI := fmt.Sprintf(
		`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=%s,%s`, fromCurrency, toCurrency)

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

func InsertCurrency(response http.ResponseWriter, request *http.Request) {
}

func RemoveCurrency(response http.ResponseWriter, request *http.Request) {
}
