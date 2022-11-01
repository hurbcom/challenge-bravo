package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/api"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
)

var initCurrencies = []string{
	"BRL",
	"EUR",
	"BTC",
	"ETH",
}

func main() {
	repository := repositories.NewCurrenciesRepository()
	backingCurrency := models.Currency{
		Code:                "USD",
		Value:               1,
		BackingCurrencyCode: "USD",
	}
	_, err := repository.Create(backingCurrency)
	if err != nil {
		log.Fatal(err)
	}
	for _, currencyCode := range initCurrencies {
		api1 := api.NewApi()
		apiValue, err := api1.CurrentValue(currencyCode, backingCurrency.Code)
		if err != nil {
			log.Fatal(err)
		}
		currency := models.Currency{
			Code:                currencyCode,
			Value:               float32(apiValue.Quotes[currencyCode]),
			BackingCurrencyCode: backingCurrency.BackingCurrencyCode,
		}
		_, err = repository.Create(currency)
		if err != nil {
			log.Fatal(err)
		}
	}
}
