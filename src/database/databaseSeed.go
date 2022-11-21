package database

import (
	"challenge-bravo/src/models"
	"log"
)

type SearchCurrencyController interface {
	GetCurrenciesBasedOnUSDFromAPI(string, []string) ([]models.ConversionRateFromAPI, error)
}

type SyncCurrencyService interface {
	InsertCurrency(models.Currency) error
}

type DatabaseSeed struct {
	searchController SearchCurrencyController
	syncService      SyncCurrencyService
}

func NewDatabaseSeed(currencySearchController SearchCurrencyController, syncCurrencyService SyncCurrencyService) *DatabaseSeed {
	return &DatabaseSeed{currencySearchController, syncCurrencyService}
}

func (databaseSeed DatabaseSeed) SeedDatabase() {

	conversionRatesByCurrency, err := databaseSeed.searchController.GetCurrenciesBasedOnUSDFromAPI("USD",
		[]string{"BRL", "EUR", "BTC", "ETH", "USD"})

	if err != nil {
		log.Fatal(err)
	}

	for _, conversionRateByCurrency := range conversionRatesByCurrency {

		currency := models.Currency{
			Name:            conversionRateByCurrency.Name,
			ConversionRate:  conversionRateByCurrency.ConversionRate,
			IsAutoUpdatable: true}

		databaseSeed.syncService.InsertCurrency(currency)
	}
}
