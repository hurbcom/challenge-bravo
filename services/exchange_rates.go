package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

const baseCurrency = "USD"

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

func GetExchangeRates() map[string]string {
	response, error :=  http.Get(fmt.Sprintf("https://api.coinbase.com/v2/exchange-rates?currency=%s", baseCurrency))

	if error != nil {
        fmt.Print(error.Error())
        os.Exit(1)
	}

	responseData, error := ioutil.ReadAll(response.Body)
	if error != nil {
		log.Fatal(error)
	}

	var responseApi ResponseApiCoinbase

	json.Unmarshal(responseData, &responseApi)

	return responseApi.Data.Rates
}
