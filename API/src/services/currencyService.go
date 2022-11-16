package services

import (
	"api/src/config"
	"api/src/database"
	"api/src/models"
	"api/src/repositories"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/go-redis/redis"
)

type CurrencyRepository interface {
	GetAllUpdatableCurrencies() ([]models.Currency, error)
	UpdateCurrency(models.Currency) error
	InsertCurrency(models.Currency) error
	DeleteCurrency(string) error
	GetAllCurrencies() ([]models.Currency, error)
	GetCurrencyByName(string) (models.Currency, error)
}

type CurrencyService struct {
	repository CurrencyRepository
}

func NewCurrencyService(repository CurrencyRepository) *CurrencyService {
	return &CurrencyService{repository}
}

func (currencyService CurrencyService) UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")

	currencies, err := currencyService.repository.GetAllUpdatableCurrencies()
	if err != nil {
		log.Fatal(err)
	}

	var currencyNames []string
	for _, currency := range currencies {
		currencyNames = append(currencyNames, currency.Name)
	}

	conversionRatesByCurrency, err := GetCurrenciesBasedOnUSDFromAPI("USD",
		currencyNames)
	if err != nil {
		log.Fatal(err)
	}

	for _, newConversionRate := range conversionRatesByCurrency {

		newCurrency := models.Currency{
			Name:            newConversionRate.Name,
			ConversionRate:  newConversionRate.ConversionRate,
			IsAutoUpdatable: true,
		}

		if err := currencyService.repository.UpdateCurrency(newCurrency); err != nil {
			log.Fatal(err)
		}
	}
}

func (currencyService CurrencyService) GetAllUpdatableCurrencies() ([]models.Currency, error) {

	updatableCurrencies, err := currencyService.repository.GetAllUpdatableCurrencies()
	if err != nil {
		return nil, err
	}

	return updatableCurrencies, nil
}

func (currencyService CurrencyService) GetAllCurrencies() ([]models.Currency, error) {

	currencies, err := currencyService.repository.GetAllCurrencies()
	if err != nil {
		return nil, err
	}

	return currencies, nil
}

func (currencyService CurrencyService) ConvertCurrency(fromCurrencyParam, toCurrencyParam string, amount float64) (models.ConversionResponse, error) {

	isFromCurrencyAllowed, err := IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	if !isFromCurrencyAllowed {
		message := fmt.Errorf("currency %s not allowed", fromCurrencyParam)
		return models.ConversionResponse{}, message
	}

	isToCurrencyAllowed, err := IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	if !isToCurrencyAllowed {
		message := fmt.Errorf("currency %s not allowed", fromCurrencyParam)
		return models.ConversionResponse{}, message
	}

	fromCurrency, err := currencyService.getCurrencyFromDatabase(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	toCurrency, err := currencyService.getCurrencyFromDatabase(toCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	conversionRate := toCurrency.ConversionRate / fromCurrency.ConversionRate

	convertedValue := amount * conversionRate

	conversionResponse := models.ConversionResponse{
		FromCurrency:   fromCurrencyParam,
		ToCurrency:     toCurrencyParam,
		Amount:         amount,
		ConvertedValue: convertedValue,
	}

	return conversionResponse, nil
}

func IsAllowedCurrency(currencyName string) (bool, error) {

	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	_, err := repository.GetCurrencyByName(currencyName)

	if err == redis.Nil {
		err = nil
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func GetCurrenciesBasedOnUSDFromAPI(fromCurrency string, toCurrencies []string) ([]models.ConversionRateFromAPI, error) {

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

func (currencyService CurrencyService) getCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	currency, err := currencyService.repository.GetCurrencyByName(currencyName)

	if err != nil {
		return models.Currency{}, err
	}

	return currency, nil
}

func (currencyService CurrencyService) InsertCurrency(currency models.Currency) error {

	currency.Name = strings.ToUpper(currency.Name)

	if err := currencyService.repository.InsertCurrency(currency); err != nil {
		return err
	}

	return nil
}

func (currencyService CurrencyService) DeleteCurrency(currencyName string) error {

	if err := currencyService.repository.DeleteCurrency(currencyName); err != nil {
		return err
	}

	return nil
}

func (currencyService CurrencyService) UpdateCurrency(currency models.Currency) error {

	if err := currencyService.repository.UpdateCurrency(currency); err != nil {
		return err
	}

	return nil
}
