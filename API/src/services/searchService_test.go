package services_test

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

	currency := models.Currency{}

	if currencyName == "FIC" {
		currency = models.Currency{
			Name:            "FIC",
			ConversionRate:  15.2,
			IsAutoUpdatable: false,
		}
	}

	if currencyName == "SHURATO" {
		currency = models.Currency{
			Name:            "SHURATO",
			ConversionRate:  43.997,
			IsAutoUpdatable: true,
		}
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
	currencies := []models.Currency{
		{
			Name:            "FIC",
			ConversionRate:  9,
			IsAutoUpdatable: false,
		},
		{
			Name:            "SHURATO",
			ConversionRate:  0.87,
			IsAutoUpdatable: true,
		},
	}

	return currencies, nil
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

type allUpdatableCurrenciesScenario struct {
	input            models.Currency
	shouldBeReturned bool
}

func TestGetAllUpdatableCurrencies(t *testing.T) {

	scenarios := []allUpdatableCurrenciesScenario{
		{
			models.Currency{
				Name:            "FIC",
				ConversionRate:  9,
				IsAutoUpdatable: false,
			},
			true,
		},
		{
			models.Currency{
				Name:            "SHURATO",
				ConversionRate:  0.87,
				IsAutoUpdatable: true,
			},
			true,
		},
		{
			models.Currency{
				Name:            "SHREK",
				ConversionRate:  12,
				IsAutoUpdatable: false,
			},
			false,
		},
	}

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	updatableCurrencies, err := searchService.GetAllUpdatableCurrencies()
	if err != nil {
		t.Error(err)
	}

	wasReturned := false
	for _, scenario := range scenarios {

		wasReturned = false

		for _, updatableCurrency := range updatableCurrencies {

			if updatableCurrency == scenario.input {
				wasReturned = true
				break
			}
		}

		if !wasReturned && scenario.shouldBeReturned {
			t.Errorf("Expected %t for currency %s, but received %t",
				scenario.shouldBeReturned, scenario.input.Name, !scenario.shouldBeReturned)
		}

	}
}

type isAllowedScenario struct {
	input    string
	expected bool
}

func TestIsAllowedCurrency(t *testing.T) {

	successScenarios := []isAllowedScenario{
		{"FIC", true},
		{"SHREK", false},
		{"SHURATO", true},
	}

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	for _, successScenario := range successScenarios {

		isAllowed, err := searchService.IsAllowedCurrency(successScenario.input)
		if err != nil {
			t.Error(err)
		}

		if isAllowed != successScenario.expected {
			t.Error(fmt.Errorf("\nCurrency %s: expected %t but received %t",
				successScenario.input, successScenario.expected, isAllowed))
		}
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
