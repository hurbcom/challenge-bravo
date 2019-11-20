package usecases

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type exchangeUsecases struct {
	URL    string
	Client http.Client
}

// NewExchangeRatesApi implements the CoinAPI interface using the exchangeratesapi
func NewExchangeRatesApi() *exchangeUsecases {
	client := http.Client{
		Timeout: time.Second * 1,
	}

	return &exchangeUsecases{
		URL:    "https://api.exchangeratesapi.io/latest?base=USD",
		Client: client,
	}
}

// RetrieveCoinValue is the implementation of the interface
func (e exchangeUsecases) RetrieveCoinValue(coin string) (float64, error) {
	req, err := http.NewRequest(http.MethodGet, e.URL+fmt.Sprintf("&symbol=%s", coin), nil)

	if err != nil {
		return 0, err
	}

	res, getError := e.Client.Do(req)

	if getError != nil {
		return 0, err
	}

	body, readError := ioutil.ReadAll(res.Body)

	if readError != nil {
		return 0, err
	}

	responseMap := make(map[string]interface{})
	jsonError := json.Unmarshal(body, &responseMap)

	if jsonError != nil {
		return 0, err
	}

	responseMap = (responseMap["rates"]).(map[string]interface{})

	return responseMap[coin].(float64), nil
}
