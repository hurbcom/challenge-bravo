package services

import (
	"challenge-bravo/src/models"
	"challenge-bravo/src/utils"
	"fmt"
	"os"
	"strings"
)

type CurrencyRepository interface {
	FindOne(string) (models.Currency, error)
	FindAll() ([]models.Currency, error)
	Create(models.Currency) error
	Delete(string) (int64, error)
	CreateCurrenciesFromApi([]models.Currency) error
}

type CurrencyService struct {
	Repository CurrencyRepository
}

func NewCurrencyService(repository CurrencyRepository) *CurrencyService {
	return &CurrencyService{repository}
}

func (serviceCurrency CurrencyService) Create(currency models.Currency) error {
	code, bid := strings.ToUpper(currency.Code), currency.Bid

	findCurrency, err := serviceCurrency.Repository.FindOne(code)
	if err == nil {
		return fmt.Errorf("Currency '%s' already exists!", findCurrency.Code)
	}

	if bid <= 0 {
		return fmt.Errorf("Bid value needs to be greater than %.2f", findCurrency.Bid)
	}

	if strings.Trim(code, " ") == "" {
		return fmt.Errorf("Currency code expects a value 'string'")
	}

	if err = serviceCurrency.Repository.Create(models.Currency{
		Code: code,
		Bid:  bid,
	}); err != nil {
		return err
	}
	return nil
}

func (serviceCurrency CurrencyService) FindAll() ([]models.Currency, error) {
	result, err := serviceCurrency.Repository.FindAll()
	if err != nil {
		return []models.Currency{}, err
	}

	return result, nil
}
func (serviceCurrency CurrencyService) Find(code string) (models.Currency, error) {
	result, err := serviceCurrency.Repository.FindOne(strings.ToUpper(code))
	if err != nil {
		return models.Currency{}, err
	}

	return result, nil
}

func (serviceCurrency CurrencyService) Delete(code string) (int64, error) {
	result, err := serviceCurrency.Repository.Delete(strings.ToUpper(code))
	if err != nil {
		return 0, err
	}

	return result, nil
}

func (serviceCurrency CurrencyService) ConvertCurrency(fromCurrency, toCurrency string, amount float64) (models.ResponseCurrency, error) {
	externalApi := utils.ExternalApi{URL: os.Getenv("API_CRYPTOCOMPARE"), Method: "GET"}
	findCurrencies := []models.Currency{}

	if amount <= 0 {
		return models.ResponseCurrency{}, fmt.Errorf("Amount value needs to be greater than %.2f", amount)
	}

	for _, curr := range []string{fromCurrency, toCurrency} {
		findCurrency, err := serviceCurrency.Repository.FindOne(strings.ToUpper(curr))
		if err != nil {
			findCurrency, err = externalApi.FindCurrencyFromApi(strings.ToUpper(curr))
			if err != nil {
				return models.ResponseCurrency{}, err
			}
			err = serviceCurrency.Repository.Create(findCurrency)
			if err != nil {
				return models.ResponseCurrency{}, err
			}
		}
		findCurrencies = append(findCurrencies, findCurrency)
	}

	convertCurrency := (amount * findCurrencies[0].Bid) / findCurrencies[1].Bid

	responseCurrency := models.ResponseCurrency{
		FromCurrency:    findCurrencies[0].Code,
		ToCurrency:      findCurrencies[1].Code,
		Amount:          amount,
		AmountConverted: convertCurrency,
	}

	return responseCurrency, nil
}
