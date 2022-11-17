package services

import (
	"api/src/models"
	"fmt"
)

type SearchRepository interface {
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	GetAllCurrencies() ([]models.Currency, error)
	GetCurrencyByName(string) (models.Currency, error)
}

type ExternalAPIAdapter interface {
	GetCurrenciesBasedOnUSD(string, []string) (map[string]float64, error)
}

type SearchService struct {
	repository  SearchRepository
	externalAPI ExternalAPIAdapter
}

func NewCurrencyService(repository SearchRepository, externalAPI ExternalAPIAdapter) *SearchService {
	return &SearchService{repository, externalAPI}
}

func (searchService SearchService) GetAllUpdatableCurrencies() ([]models.Currency, error) {

	updatableCurrencies, err := searchService.repository.GetAllUpdatableCurrencies()
	if err != nil {
		return nil, err
	}

	return updatableCurrencies, nil
}

func (searchService SearchService) GetAllCurrencies() ([]models.Currency, error) {

	currencies, err := searchService.repository.GetAllCurrencies()
	if err != nil {
		return nil, err
	}

	return currencies, nil
}

func (searchService SearchService) IsAllowedCurrency(currencyName string) (bool, error) {

	_, err := searchService.repository.GetCurrencyByName(currencyName)

	if err != nil {
		return false, err
	}

	return true, nil
}

func (searchService SearchService) GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {

	mapAPIResponse, err := searchService.externalAPI.GetCurrenciesBasedOnUSD(fromCurrency, toCurrencies)
	if err != nil {
		fmt.Println("error trying to call external API:", err)
		return nil, err
	}

	var conversionRatesFromAPI []models.ConversionRateFromAPI

	for _, toCurrency := range toCurrencies {
		conversionRate := mapAPIResponse[toCurrency] / mapAPIResponse[fromCurrency]
		conversionRatesFromAPI = append(conversionRatesFromAPI, models.ConversionRateFromAPI{
			Name:           toCurrency,
			ConversionRate: conversionRate,
		})
	}

	return conversionRatesFromAPI, nil
}

func (searchService SearchService) GetCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	currency, err := searchService.repository.GetCurrencyByName(currencyName)

	if err != nil {
		return models.Currency{}, err
	}

	return currency, nil
}
