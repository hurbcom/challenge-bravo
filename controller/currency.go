package controller

import (
	coinmarket "github.com/hurbcom/challenge-bravo/plugin/coinmarketcap"
	"github.com/hurbcom/challenge-bravo/plugin/fixer"
)

type CurrencyController struct {
	API       fixer.Fixer
	CryptoAPI coinmarket.CoinMarketCap
}

//GetRates gets all rates in a key:value format
func (cc CurrencyController) GetRates() (map[string]float64, error) {
	response, err := cc.API.GetRates()
	if err != nil {
		return nil, err
	}
	return response.Rates, nil
}

//GetCryptoRates gets all rates in a key:value format from CryptoCoins
func (cc CurrencyController) GetCryptoRates() (map[string]float64, error) {
	response, err := cc.CryptoAPI.GetRates()
	if err != nil {
		return nil, err
	}
	currency := make(map[string]float64)
	for key, value := range response.Data {
		currency[key] = value.Quote.EUR.Price
	}
	return currency, nil
}
