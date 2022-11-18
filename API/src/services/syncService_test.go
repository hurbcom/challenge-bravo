package services_test

import (
	"api/src/adapters"
	"api/src/models"
	"api/src/services"
	"fmt"
	"testing"
)

type SearchServiceMock struct {
}

func (searchServiceMock SearchServiceMock) GetAllUpdatableCurrencies() ([]models.Currency, error) {
	currencies := []models.Currency{
		{
			Name:            "FIC",
			ConversionRate:  9,
			IsAutoUpdatable: true,
		},
		{
			Name:            "SHURATO",
			ConversionRate:  0.87,
			IsAutoUpdatable: true,
		},
	}

	return currencies, nil
}

func (searchServiceMock SearchServiceMock) GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {

	if fromCurrency != "USD" {
		err := fmt.Errorf("fromCurrency EXPECTED: 'USD' | RECEIVED: '%s'", fromCurrency)
		return nil, err
	}

	conversionRatesFromAPI := []models.ConversionRateFromAPI{
		{
			Name:           "USD",
			ConversionRate: 1,
		},
		{
			Name:           "BRL",
			ConversionRate: 5.36,
		},
		{
			Name:           "BTC",
			ConversionRate: 0.00005992,
		},
	}

	return conversionRatesFromAPI, nil
}

type SyncRepositoryMock struct {
}

func (syncRepositoryMock SyncRepositoryMock) UpdateAllUpdatableCurrencies() {
}

func TestUpdateAllUpdatableCurrencies(t *testing.T) {

	searchService := SearchServiceMock{}
	syncRepository := SyncRepositoryMock{}
	syncService := services.NewSyncService(syncRepository, searchService)

	syncService.UpdateAllUpdatableCurrencies()

}

func (syncRepositoryMock SyncRepositoryMock) InsertCurrency(currency models.Currency) error {
	if currency.Name == "WRONG" {
		return fmt.Errorf("Currency WRONG could not be deleted.")
	}

	return nil
}

type insertCurrencyScenario struct {
	currency   models.Currency
	shouldWork bool
}

func TestInsertCurrency(t *testing.T) {

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)
	syncRepository := SyncRepositoryMock{}
	syncService := services.NewSyncService(syncRepository, searchService)

	insertScenarios := []insertCurrencyScenario{
		{
			models.Currency{
				Name:            "FIC",
				ConversionRate:  15.2,
				IsAutoUpdatable: true,
			}, true,
		},
		{
			models.Currency{
				Name:            "ANOTHER",
				ConversionRate:  333,
				IsAutoUpdatable: false,
			}, true,
		},
		{
			models.Currency{
				Name:            "WRONG",
				ConversionRate:  23,
				IsAutoUpdatable: true,
			}, false,
		},
	}

	for _, insertScenario := range insertScenarios {
		err := syncService.InsertCurrency(insertScenario.currency)

		if err != nil && insertScenario.shouldWork {
			t.Error(err)
		}
	}
}

func (syncRepositoryMock SyncRepositoryMock) DeleteCurrency(currencyName string) error {

	if currencyName == "WRONG" {
		return fmt.Errorf("Currency WRONG could not be deleted.")
	}

	return nil
}

type deleteCurrencyScenario struct {
	currency   models.Currency
	shouldWork bool
}

func TestDeleteCurrency(t *testing.T) {

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)
	syncRepository := SyncRepositoryMock{}
	syncService := services.NewSyncService(syncRepository, searchService)

	deleteScenarios := []deleteCurrencyScenario{
		{
			models.Currency{
				Name:            "FIC",
				ConversionRate:  15.2,
				IsAutoUpdatable: true,
			}, true,
		},
		{
			models.Currency{
				Name:            "ANOTHER",
				ConversionRate:  333,
				IsAutoUpdatable: false,
			}, true,
		},
		{
			models.Currency{
				Name:            "WRONG",
				ConversionRate:  543,
				IsAutoUpdatable: false,
			}, false,
		},
	}

	for _, deleteScenario := range deleteScenarios {
		err := syncService.DeleteCurrency(deleteScenario.currency.Name)

		if err != nil && deleteScenario.shouldWork {
			t.Error(err)
		}
	}
}

func (syncRepositoryMock SyncRepositoryMock) UpdateCurrency(currency models.Currency) error {
	if currency.Name == "WRONG" {
		return fmt.Errorf("Currency WRONG could not be updated.")
	}

	return nil
}

type updateCurrencyScenario struct {
	currency   models.Currency
	shouldWork bool
}

func TestUpdateCurrency(t *testing.T) {

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)
	syncRepository := SyncRepositoryMock{}
	syncService := services.NewSyncService(syncRepository, searchService)

	updateScenarios := []updateCurrencyScenario{
		{
			models.Currency{
				Name:            "FIC",
				ConversionRate:  15.2,
				IsAutoUpdatable: true,
			}, true,
		},
		{
			models.Currency{
				Name:            "ANOTHER",
				ConversionRate:  333,
				IsAutoUpdatable: false,
			}, true,
		},
		{
			models.Currency{
				Name:            "WRONG",
				ConversionRate:  543,
				IsAutoUpdatable: false,
			}, false,
		},
	}

	for _, updateScenario := range updateScenarios {
		err := syncService.UpdateCurrency(updateScenario.currency)

		if err != nil && updateScenario.shouldWork {
			t.Error(err)
		}
	}
}
