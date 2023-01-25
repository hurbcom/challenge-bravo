package services

import (
	"challenge-bravo/src/utils"
	"fmt"
	"os"
)

func CronUpdateCurrenciesFromApi(repository CurrencyRepository) error {
	fmt.Println("CRON INICIADA--------------------")

	externalApi := utils.ExternalApi{URL: os.Getenv("API_CRYPTOCOMPARE"), Method: "GET"}
	getApiCurrencies, err := externalApi.GetCurrenciesFromApi()
	if err != nil {
		return err
	}

	if err = repository.CreateCurrenciesFromApi(getApiCurrencies); err != nil {
		return err
	}
	fmt.Println("CRON FINALIZADA--------------------")
	return nil
}
