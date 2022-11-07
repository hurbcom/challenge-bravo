package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/services"
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
	repository := repositories.NewCurrenciesRepository()
	if err != nil {
		log.Fatal(err)
	}
	ethToUsd := models.Currency{
		Code:                "ETH",
		Value:               1539.46,
		BackingCurrencyCode: settings.BackingCurrencyCode,
	}
	err = repository.CreateOrUpdate(ethToUsd)
	if err != nil {
		log.Fatal(err)
	}
	for _, code := range initCurrencies {
		create(code, settings.BackingCurrencyCode)
	}
}

func create(sourceCurrency, targetCurrency string) {
	repository := repositories.NewCurrenciesRepository()
	api1 := services.NewExchangeApiService()
	apiValue, err := api1.CurrentValue(sourceCurrency, targetCurrency)
	if err != nil {
		log.Fatal(err)
	}
	currency := models.Currency{
		Code:                sourceCurrency,
		Value:               apiValue.Value,
		BackingCurrencyCode: targetCurrency,
	}
	err = repository.CreateOrUpdate(currency)
	if err != nil {
		log.Fatal(err)
	}
}
