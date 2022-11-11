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

func UpdateAllUpdatableCurrencies() {
	fmt.Println("##### NEW JOB RUN #####")
	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	currencies, err := repository.GetAllUpdatableCurrencies()
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

		if err := repository.UpdateCurrency(newCurrency); err != nil {
			log.Fatal(err)
		}
	}
}

func GetAllUpdatableCurrencies() ([]models.Currency, error) {
	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	updatableCurrencies, err := repository.GetAllUpdatableCurrencies()
	if err != nil {
		return nil, err
	}

	return updatableCurrencies, nil
}

func GetAllCurrencies() ([]models.Currency, error) {
	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	currencies, err := repository.GetAllCurrencies()
	if err != nil {
		return nil, err
	}

	return currencies, nil
}

func ConvertCurrency(fromCurrencyParam, toCurrencyParam string, amount float64) (models.ConversionResponse, error) {

	fromCurrency, err := getCurrencyFromDatabase(fromCurrencyParam)
	if err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", toCurrencyParam)
		return models.ConversionResponse{}, err
	}

	if err != nil {
		return models.ConversionResponse{}, err
	}

	toCurrency, err := getCurrencyFromDatabase(toCurrencyParam)
	if err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", toCurrencyParam)
		return models.ConversionResponse{}, err
	}

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

func getCurrencyFromDatabase(currencyName string) (models.Currency, error) {

	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	currency, err := repository.GetCurrencyByName(currencyName)

	if currency == (models.Currency{}) && err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", currencyName)
		return models.Currency{}, err
	}

	if err != nil {
		return models.Currency{}, err
	}

	return currency, nil
}

func InsertCurrency(currency models.Currency) error {

	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	currency.Name = strings.ToUpper(currency.Name)

	if err := repository.InsertCurrency(currency); err != nil {
		return err
	}

	return nil
}

func DeleteCurrency(currencyName string) error {

	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	if repository.DeleteCurrency(currencyName).Val() == 0 {
		err := fmt.Errorf("no key %s found to be deleted", currencyName)
		return err
	}

	return nil
}

func UpdateCurrency(currency models.Currency) error {
	database := database.Connect()
	defer database.Close()

	repository := repositories.NewCurrencyRepository(database)

	if err := repository.UpdateCurrency(currency); err != nil {
		return err
	}

	return nil
}
