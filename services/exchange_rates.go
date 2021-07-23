package services

/**
* The purpose of this package is get the actual real exchange rates.
* The api used is provided by Coinbase https://www.coinbase.com/
*
* This code only works for consume the api provided by Coinbase.
* The documentation used can be accessed at this
* link: https://developers.coinbase.com/api/
*
* Gustavo Willer - 23/07/2021
 */

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/models"
)

/**
* This type struct represents the interface that map the output
* response of endpoint https://api.coinbase.com/v2/exchange-rates
* The documentation used for this purpose, can be accessed at this
* link: https://developers.coinbase.com/api/v2#get-exchange-rates
*
* Gustavo Willer - 20/07/2021
 */
type ResponseApiCoinbase struct {
	Data struct {
		Rates map[string]string
	}
}

// Get all current exchange rates provided by an external api
func AllExchangeRates() (map[string]string, error) {
	response, error := http.Get(getApiURI())

	if error != nil {
		fmt.Printf(error.Error())
		return nil, error
	}

	responseData, error := ioutil.ReadAll(response.Body)
	if error != nil {
		log.Printf(error.Error())
		return nil, error
	}

	var responseApi ResponseApiCoinbase

	json.Unmarshal(responseData, &responseApi)

	return responseApi.Data.Rates, nil
}

func updateExchangeRates() {
	var currencies []map[string]interface{}

	exchangeRates, error := AllExchangeRates()
	if error != nil {
		log.Printf(error.Error())
		return
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	database.Model(&models.Currency{}).Where("is_real = 1").Find(&currencies)

	for _, currency := range currencies {

		exchangeRate, found := exchangeRates[currency["code"].(string)]
		if !found {
			log.Fatal(fmt.Sprintf("No real value exchange rate found for the currency %s", currency["code"]))
			return
		}

		database.Model(&models.Currency{}).Where("id = ?", currency["id"]).Update("exchange_rate", exchangeRate)
	}
}

// Create the routine hourly for update the exchage rates of real currencies
func HourlyUpdateExchangeRates() {
	for {
		updateExchangeRates()
		time.Sleep(time.Hour)
	}
}

func getApiURI() string {
	return fmt.Sprintf(
		"https://api.coinbase.com/v2/exchange-rates?currency=%s",
		os.Getenv("BASE_CURRENCY"),
	)
}
