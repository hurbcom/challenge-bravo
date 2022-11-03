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
		create(currencyCode, backingCurrency.Code)
		create(backingCurrency.Code, currencyCode)
	}
}
func create(from, to string) {
	repository := repositories.NewCurrenciesRepository()
	api1 := api.NewApi()
	apiValue, err := api1.CurrentValue(from, to)
	if err != nil {
		log.Fatal(err)
	}
	log.Print(apiValue.Quotes[from+to])
	currency := models.Currency{
		Code:                from,
		Value:               apiValue.Quotes[from+to],
		BackingCurrencyCode: to,
	}
	_, err = repository.Create(currency)
	if err != nil {
		log.Fatal(err)
	}
}
