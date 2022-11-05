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
}

func main() {
	repository := repositories.NewExchangesRepository()
	backingRate := models.Rate{
		Code:                "USD",
		Value:               1,
		BackingCurrencyCode: "USD",
	}
	err := repository.Create(backingRate)
	if err != nil {
		log.Fatal(err)
	}
	ethToUsd := models.Rate{
		Code:                "ETH",
		Value:               1539.46,
		BackingCurrencyCode: "USD",
	}
	usdToEth := models.Rate{
		Code:                "USD",
		Value:               0.00065,
		BackingCurrencyCode: "ETH",
	}
	err = repository.Create(ethToUsd)
	if err != nil {
		log.Fatal(err)
	}
	err = repository.Create(usdToEth)
	if err != nil {
		log.Fatal(err)
	}
	for _, currencyCode := range initCurrencies {
		create(currencyCode, backingRate.Code)
		create(backingRate.Code, currencyCode)
	}
}

func create(from, to string) {
	repository := repositories.NewExchangesRepository()
	api1 := api.NewApi()
	apiValue, err := api1.CurrentValue(from, to)
	if err != nil {
		log.Fatal(err)
	}

	rate := models.Rate{
		Code:                from,
		Value:               apiValue.Rates[to],
		BackingCurrencyCode: to,
	}
	err = repository.Create(rate)
	if err != nil {
		log.Fatal(err)
	}
}
