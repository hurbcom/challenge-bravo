package services_test

import (
	"challenge-bravo/src/models"
	"challenge-bravo/src/services"
	"fmt"
	"testing"
)

type SearchConversionServiceMock struct {
}

func (searchConversionService *SearchConversionServiceMock) IsAllowedCurrency(currencyName string) (bool, error) {

	allowedCurrencies := []string{"USD", "BRL", "BTC", "ETH", "EUR"}

	for _, allowedCurrency := range allowedCurrencies {

		if currencyName == "WRONG" {
			return true, fmt.Errorf("WRONG currency should not be allowed")
		}

		if currencyName == allowedCurrency {
			return true, nil
		}
	}

	return false, nil
}

func (searchConversionService *SearchConversionServiceMock) GetCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	databaseCurrencies := []string{"USD", "BRL", "BTC", "ETH", "EUR"}

	existsOnDatabase := false
	for _, databaseCurrency := range databaseCurrencies {
		if currencyName == databaseCurrency {
			existsOnDatabase = true
			break
		}
	}

	currency := models.Currency{}

	if !existsOnDatabase {
		err := fmt.Errorf("\nCurrency %s not found", currencyName)
		return currency, err
	}

	switch currencyName {
	case "USD":
		currency = models.Currency{
			Name:            "USD",
			ConversionRate:  1,
			IsAutoUpdatable: true,
		}
	case "BRL":
		currency = models.Currency{
			Name:            "BRL",
			ConversionRate:  5.36,
			IsAutoUpdatable: true,
		}
	case "EUR":
		currency = models.Currency{
			Name:            "EUR",
			ConversionRate:  0.9653,
			IsAutoUpdatable: true,
		}
	case "BTC":
		currency = models.Currency{
			Name:            "BTC",
			ConversionRate:  0.00005992,
			IsAutoUpdatable: true,
		}
	case "ETH":
		currency = models.Currency{
			Name:            "ETH",
			ConversionRate:  0.0008256,
			IsAutoUpdatable: true,
		}
	}

	return currency, nil
}

type conversionScenario struct {
	fromCurrencyName       string
	toCurrencyName         string
	amount                 float64
	expectedConvertedValue float64
}

func TestConvertCurrency(t *testing.T) {

	successScenarios := []conversionScenario{
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "BRL",
			amount:                 1.0,
			expectedConvertedValue: 5.36,
		},
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "EUR",
			amount:                 7.0,
			expectedConvertedValue: 6.7571,
		},
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "BTC",
			amount:                 1.0,
			expectedConvertedValue: 0.00005992,
		},
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "ETH",
			amount:                 10.0,
			expectedConvertedValue: 0.008256,
		},
	}

	errorScenarios := []conversionScenario{
		{
			fromCurrencyName:       "XONPLK",
			toCurrencyName:         "ZENIAT",
			amount:                 10.0,
			expectedConvertedValue: 0,
		},
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "ZENIAT",
			amount:                 10.0,
			expectedConvertedValue: 0,
		},
		{
			fromCurrencyName:       "WRONG",
			toCurrencyName:         "ZENIAT",
			amount:                 10.0,
			expectedConvertedValue: 0,
		},
		{
			fromCurrencyName:       "USD",
			toCurrencyName:         "WRONG",
			amount:                 10.0,
			expectedConvertedValue: 0,
		},
	}

	searchService := SearchConversionServiceMock{}
	conversionService := services.ConversionService{SearchService: &searchService}

	for _, successScenario := range successScenarios {

		conversionResponse, err := conversionService.ConvertCurrency(
			successScenario.fromCurrencyName, successScenario.toCurrencyName, successScenario.amount)
		if err != nil {
			t.Error(err)
		}

		receivedConvertedValue := conversionResponse.ConvertedValue

		if successScenario.expectedConvertedValue != receivedConvertedValue {
			t.Error(fmt.Errorf("\nfromCurrency: %s | toCurrency: %s | EXPECTED: %.8F | RECEIVED: %.8F",
				successScenario.fromCurrencyName, successScenario.toCurrencyName,
				successScenario.expectedConvertedValue, receivedConvertedValue))
		}
	}

	for _, errorScenario := range errorScenarios {

		_, err := conversionService.ConvertCurrency(
			errorScenario.fromCurrencyName, errorScenario.toCurrencyName, errorScenario.amount)
		if err == nil {
			t.Error("\nError Scenario passed! - ", errorScenario)
		}

	}
}
