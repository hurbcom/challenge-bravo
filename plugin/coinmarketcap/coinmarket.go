package coinmarket

import (
	"encoding/json"
	"errors"
	"net/http"
)

type CoinMarketCap struct {
	Caller Caller
}

//GetRates get the current currency rates from CoinMarketCap
func (c *CoinMarketCap) GetRates() (RatesResponse, error) {
	var rates RatesResponse

	path := "cryptocurrency/quotes/latest"
	formValues := map[string]string{
		"symbol":  "ETH,BTC",
		"convert": "EUR",
	}
	response, err := c.Caller.CallAPI(http.MethodGet, path, formValues)
	if err != nil {
		return rates, err
	}
	err = json.Unmarshal(response, &rates)
	if rates.Status.ErrorCode != 0 {
		return rates, errors.New(rates.Status.ErrorMessage)
	}
	return rates, err
}
