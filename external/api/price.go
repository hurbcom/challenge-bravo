package api

import (
	"encoding/json"
	"fmt"
	"github.com/joaohgf/challenge-bravo/external/repository/models"
)

type ResponseCurrency struct {
	Brlusd *models.CurrencyPrice `json:"BRLUSD"`
	Btcusd *models.CurrencyPrice `json:"BTCUSD"`
	Eurusd *models.CurrencyPrice `json:"EURUSD"`
	Ethusd *models.CurrencyPrice `json:"ETHUSD"`
}

func (e *Engine) GetAllCurrency() ([]*models.CurrencyPrice, error) {
	var resp, err = e.get(fmt.Sprintf("%s/last/BRL-USD,BTC-USD,EUR-USD,ETH-USD", e.URL))
	if err != nil {
		return nil, err
	}
	var currencies = new(ResponseCurrency)
	err = json.Unmarshal(resp, currencies)
	if err != nil {
		return nil, err
	}

	return e.MakeResponse(currencies), nil
}

func (e *Engine) MakeResponse(currencyPrices *ResponseCurrency) []*models.CurrencyPrice {
	var currencyPricesList = make([]*models.CurrencyPrice, 0)
	currencyPricesList = append(currencyPricesList, currencyPrices.Brlusd)
	currencyPricesList = append(currencyPricesList, currencyPrices.Btcusd)
	currencyPricesList = append(currencyPricesList, currencyPrices.Eurusd)
	currencyPricesList = append(currencyPricesList, currencyPrices.Ethusd)

	return currencyPricesList

}
