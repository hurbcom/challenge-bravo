package services

import (
	"api/src/adapters"
	"api/src/models"
	"api/src/services"
	"fmt"
	"testing"
)

type SearchRepositoryMock struct {
}

func (searchRepository *SearchRepositoryMock) GetCurrencyByName(currencyName string) (models.Currency, error) {

	currency := models.Currency{
		Name:            "FIC",
		ConversionRate:  15.2,
		IsAutoUpdatable: false,
	}

	return currency, nil
}

func (searchRepository *SearchRepositoryMock) GetAllCurrencies() ([]models.Currency, error) {

	currency := models.Currency{
		Name:            "FIC",
		ConversionRate:  15.2,
		IsAutoUpdatable: false,
	}

	return []models.Currency{currency}, nil
}

func (searchRepository *SearchRepositoryMock) GetAllUpdatableCurrencies() ([]models.Currency, error) {
	return nil, nil
}

type ExternalAPIAdapterMock struct {
}

func (externalAPIAdapterMock *ExternalAPIAdapterMock) GetCurrenciesBasedOnUSD(fromCurrency string, toCurrencies []string) (map[string]float64, error) {

	if fromCurrency != "USD" {
		err := fmt.Errorf("fromCurrency EXPECTED: 'USD' | RECEIVED: '%s'", fromCurrency)
		return nil, err
	}

	if toCurrencies[0] != "USD" {
		err := fmt.Errorf("toCurrency EXPECTED: 'USD' | RECEIVED: '%s'", toCurrencies[0])
		return nil, err
	}

	if toCurrencies[1] != "BRL" {
		err := fmt.Errorf("toCurrency EXPECTED: 'BRL' | RECEIVED: '%s'", toCurrencies[0])
		return nil, err
	}

	if toCurrencies[2] != "BTC" {
		err := fmt.Errorf("toCurrency EXPECTED: 'BTC' | RECEIVED: '%s'", toCurrencies[1])
		return nil, err
	}

	mapFromAPI := map[string]float64{
		"USD": 1,
		"BRL": 5.36,
		"BTC": 0.00005992,
	}

	return mapFromAPI, nil
}

func TestIsAllowedCurrency(t *testing.T) {

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	currency := models.Currency{
		Name:            "FIC",
		ConversionRate:  15.2,
		IsAutoUpdatable: false,
	}

	isAllowed, err := searchService.IsAllowedCurrency(currency.Name)
	if err != nil {
		t.Error(err)
	}

	if !isAllowed {
		t.Error(fmt.Errorf("EXPECTED 'ALLOWED' BUT RECEIVED 'NOT ALLOWED'"))
	}

}

func TestGetCurrenciesBasedOnUSDFromAPI(t *testing.T) {

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := ExternalAPIAdapterMock{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	receivedConversionRates, err := searchService.GetCurrenciesBasedOnUSDFromAPI("USD", []string{"USD", "BRL", "BTC"})
	if err != nil {
		t.Error(err)
	}

	expectedConversionRates := []models.ConversionRateFromAPI{
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

	for _, receivedConversionRate := range receivedConversionRates {
		for _, expectedConversionRate := range expectedConversionRates {

			if receivedConversionRate.Name == expectedConversionRate.Name &&
				receivedConversionRate.ConversionRate != expectedConversionRate.ConversionRate {

				err := fmt.Errorf("\nConversion Rate EXPECTED: %.8f | Conversion Rate RECEIVED: %.8f",
					expectedConversionRate.ConversionRate, receivedConversionRate.ConversionRate)

				t.Error(err)
			}
		}

	}
}
