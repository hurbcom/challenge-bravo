package adapters

import (
	"api/src/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ExternalAPIAdapter struct {
}

func (externalAPI *ExternalAPIAdapter) GetCurrenciesBasedOnUSD(fromCurrency string, toCurrencies []string) (map[string]float64, error) {

	urlToExternalAPI := config.UrlToExternalAPI + "?fsym=" + fromCurrency + `&tsyms=` + fromCurrency

	for _, toCurrency := range toCurrencies {
		urlToExternalAPI += "," + toCurrency
	}

	currencyAPIResponse, err := http.Get(urlToExternalAPI)
	if err != nil {
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

	return mapAPIResponse, nil

}
