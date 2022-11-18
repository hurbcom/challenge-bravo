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

	currencies := []models.Currency{
		{
			Name:            "FIC",
			ConversionRate:  12,
			IsAutoUpdatable: false,
		},
		{
			Name:            "SHURATO",
			ConversionRate:  171,
			IsAutoUpdatable: true,
		},

		{
			Name:            "SAZON",
			ConversionRate:  3.889,
			IsAutoUpdatable: true,
		},
	}

	return currencies, nil
}

func (searchRepository *SearchRepositoryMock) GetAllUpdatableCurrencies() ([]models.Currency, error) {
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
	currencies        []models.Currency
	shouldAllRowsMeet bool
}

func TestGetAllUpdatableCurrencies(t *testing.T) {

	scenarios := []allUpdatableCurrenciesScenario{
		{
			[]models.Currency{
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
			}, true,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
			}, false,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
				{
					Name:            "SHURATO",
					ConversionRate:  171,
					IsAutoUpdatable: true,
				},
			}, false,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
				{
					Name:            "SHURATO",
					ConversionRate:  0.87,
					IsAutoUpdatable: true,
				},
				{
					Name:            "WRONGONE",
					ConversionRate:  4.54,
					IsAutoUpdatable: true,
				},
			}, false,
		},
	}

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	updatableCurrencies, err := searchService.GetAllUpdatableCurrencies()
	if err != nil {
		t.Error(err)
	}

	for index, scenario := range scenarios {

		if len(scenario.currencies) == len(updatableCurrencies) {
			allRowsMeet := true

			for index, updatableCurrency := range updatableCurrencies {
				if updatableCurrency != scenario.currencies[index] {
					allRowsMeet = false
					break
				}
			}

			if allRowsMeet != scenario.shouldAllRowsMeet {
				t.Errorf("Expected %t for scenario %d, but received %t",
					scenario.shouldAllRowsMeet, index+1, allRowsMeet)
			}
		}

		if len(scenario.currencies) != len(updatableCurrencies) && scenario.shouldAllRowsMeet {
			t.Errorf("Expected %d rows for scenario %d, but received %d",
				len(updatableCurrencies), index+1, len(scenario.currencies))
		}
	}
}

type allCurrenciesScenario struct {
	currencies        []models.Currency
	shouldAllRowsMeet bool
}

func TestGetAllCurrencies(t *testing.T) {

	scenarios := []allCurrenciesScenario{
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
				{
					Name:            "SHURATO",
					ConversionRate:  171,
					IsAutoUpdatable: true,
				},
				{
					Name:            "SAZON",
					ConversionRate:  3.889,
					IsAutoUpdatable: true,
				},
			}, true,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
			}, false,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
				{
					Name:            "SHURATO",
					ConversionRate:  171,
					IsAutoUpdatable: true,
				},
			}, false,
		},
		{
			[]models.Currency{
				{
					Name:            "FIC",
					ConversionRate:  12,
					IsAutoUpdatable: false,
				},
				{
					Name:            "SHURATO",
					ConversionRate:  171,
					IsAutoUpdatable: true,
				},
				{
					Name:            "WRONGONE",
					ConversionRate:  4.54,
					IsAutoUpdatable: true,
				},
			}, false,
		},
	}

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	allCurrencies, err := searchService.GetAllCurrencies()
	if err != nil {
		t.Error(err)
	}

	for index, scenario := range scenarios {

		if len(scenario.currencies) == len(allCurrencies) {
			allRowsMeet := true

			for index, currency := range allCurrencies {
				if currency != scenario.currencies[index] {
					allRowsMeet = false
					break
				}
			}

			if allRowsMeet != scenario.shouldAllRowsMeet {
				t.Errorf("Expected %t for scenario %d, but received %t",
					scenario.shouldAllRowsMeet, index+1, allRowsMeet)
			}
		}

		if len(scenario.currencies) != len(allCurrencies) && scenario.shouldAllRowsMeet {
			t.Errorf("Expected %d rows for scenario %d, but received %d",
				len(allCurrencies), index+1, len(scenario.currencies))
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

type currencyByNameScenario struct {
	currencyName     string
	shouldBeReturned bool
}

func TestGetCurrencyFromDatabase(t *testing.T) {

	scenarios := []currencyByNameScenario{
		{"FIC", true},
		{"SHREK", false},
		{"SHURATO", true},
	}

	searchRepository := SearchRepositoryMock{}
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchService := services.NewCurrencyService(&searchRepository, &externalApiAdapter)

	for _, scenario := range scenarios {

		currencyFromDatabase, err := searchService.GetCurrencyFromDatabase(scenario.currencyName)
		if err != nil {
			t.Error(err)
		}

		if (currencyFromDatabase == models.Currency{}) && scenario.shouldBeReturned {
			t.Errorf("Currency %s was supposed to be found, but wasnt.", scenario.currencyName)
		}

		if currencyFromDatabase.Name != scenario.currencyName && scenario.shouldBeReturned {
			t.Errorf("Expected %s | RECEIVED %s", scenario.currencyName, currencyFromDatabase.Name)
		}

		if currencyFromDatabase.Name == scenario.currencyName && !scenario.shouldBeReturned {
			t.Errorf("Currency %s was not supposed to be found, but was.", scenario.currencyName)
		}
	}
}
