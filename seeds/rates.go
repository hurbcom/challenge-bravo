package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/api"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/settings"
)

var initCurrencies = []string{
	"BRL",
	"EUR",
	"BTC",
}

func main() {
	settings, err := settings.NewSettings()
	if err != nil {
		log.Fatalf("couldn't load settings")
	}
	repository := repositories.NewExchangesRepository()
	if err != nil {
		log.Fatal(err)
	}
	ethToUsd := models.Rate{
		Code:                "ETH",
		Value:               1539.46,
		BackingCurrencyCode: settings.BackingCurrencyCode,
	}
	err = repository.CreateOrUpdate(ethToUsd)
	if err != nil {
		log.Fatal(err)
	}
	for _, currencyCode := range initCurrencies {
		create(currencyCode, settings.BackingCurrencyCode)
	}
}

func create(sourceCurrency, targetCurrency string) {
	repository := repositories.NewExchangesRepository()
	api1 := api.NewApi()
	apiValue, err := api1.CurrentValue(sourceCurrency, targetCurrency)
	if err != nil {
		log.Fatal(err)
	}
	rate := models.Rate{
		Code:                sourceCurrency,
		Value:               apiValue.Rates[targetCurrency],
		BackingCurrencyCode: targetCurrency,
	}
	err = repository.CreateOrUpdate(rate)
	if err != nil {
		log.Fatal(err)
	}
}
