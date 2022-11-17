package services

import (
	"api/src/config"
	"api/src/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-redis/redis"
)

type CurrencyRepository interface {
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	GetAllCurrencies() ([]models.Currency, error)
	GetCurrencyByName(string) (models.Currency, error)
}

type SearchService struct {
	repository CurrencyRepository
}

func NewCurrencyService(repository CurrencyRepository) *SearchService {
	return &SearchService{repository}
}

func (currencyService SearchService) GetAllUpdatableCurrencies() ([]models.Currency, error) {

	updatableCurrencies, err := currencyService.repository.GetAllUpdatableCurrencies()
	if err != nil {
		return nil, err
	}

	return updatableCurrencies, nil
}

func (currencyService SearchService) GetAllCurrencies() ([]models.Currency, error) {

	currencies, err := currencyService.repository.GetAllCurrencies()
	if err != nil {
		return nil, err
	}

	return currencies, nil
}

func (currencyService SearchService) IsAllowedCurrency(currencyName string) (bool, error) {

	_, err := currencyService.repository.GetCurrencyByName(currencyName)

	if err == redis.Nil {
		err = nil
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func (currencyService SearchService) GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {

	urlToExternalAPI := config.UrlToExternalAPI + "?fsym=" + fromCurrency + `&tsyms=` + fromCurrency

	for _, toCurrency := range toCurrencies {
		urlToExternalAPI += "," + toCurrency
	}

	currencyAPIResponse, err := http.Get(urlToExternalAPI)

	if err != nil {
		fmt.Println("error trying to call external API:", err)
		return nil, err
	}

	responseData, err := io.ReadAll(currencyAPIResponse.Body)

	if err != nil {
		fmt.Println("error trying to read response data:", err)
		return nil, err
	}

	var mapAPIResponse map[string]float64

	if err = json.Unmarshal(responseData, &mapAPIResponse); err != nil {
		fmt.Println("error trying to Unmarshal response data:", err)
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

func (currencyService SearchService) GetCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	currency, err := currencyService.repository.GetCurrencyByName(currencyName)

	if err != nil {
		return models.Currency{}, err
	}

	return currency, nil
}
