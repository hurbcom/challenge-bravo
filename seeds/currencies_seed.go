package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/helpers"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/services"
)

var initCurrencies = []string{
	"BRL",
	"EUR",
}

func main() {
	err := helpers.LoadEnv()
	if err != nil {
		log.Fatalf("could not load settings")
	}
	repository := repositories.NewCurrenciesRepository()
	if err != nil {
		log.Fatal(err)
	}
	ethToUsd := models.Currency{
		Code:                "ETH",
		Value:               1156.94,
		BackingCurrencyCode: helpers.Env.BackingCurrencyCode,
	}
	btcToUsd := models.Currency{
		Code:                "BTC",
		Value:               16387,
		BackingCurrencyCode: helpers.Env.BackingCurrencyCode,
	}
	err = repository.CreateOrUpdate(ethToUsd)
	if err != nil {
		log.Fatal(err)
	}
	err = repository.CreateOrUpdate(btcToUsd)
	if err != nil {
		log.Fatal(err)
	}
	for _, code := range initCurrencies {
		create(code, helpers.Env.BackingCurrencyCode)
	}
}

func create(sourceCurrency, targetCurrency string) {
	repository := services.NewCurrenciesService()
	api1 := services.NewExchangeApiService()
	apiValue, err := api1.GetCurrency(sourceCurrency, targetCurrency)
	if err != nil {
		log.Fatal(err)
	}
	err = repository.CreateOrUpdate(sourceCurrency, apiValue.Value)
	if err != nil {
		log.Fatal(err)
	}
}
