package services

import (
	"errors"

	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/settings"
)

type CurrenciesService struct {
	BackingCurrencyCode string
	ExchangeApiService  IExchangeApiService
	Repository          repositories.ICurrenciesRepository
}

func NewCurrenciesService() *CurrenciesService {
	settings, _ := settings.NewSettings()
	return &CurrenciesService{
		BackingCurrencyCode: settings.BackingCurrencyCode,
		ExchangeApiService:  NewExchangeApiService(),
		Repository:          repositories.NewCurrenciesRepository(),
	}
}

func (service *CurrenciesService) ConvertCurrencies(amount float64, sourceCurrencyCode, targetCurrencyCode string) (float64, error) {
	sourceCurrency, err := service.GetCurrency(sourceCurrencyCode)
	if err != nil {
		return 0, err
	}
	targetCurrency, err := service.GetCurrency(targetCurrencyCode)
	if err != nil {
		return 0, err
	}

	return service.ConvertFromCurrencies(amount, sourceCurrency, targetCurrency), nil
}

func (service *CurrenciesService) GetCurrency(currency string) (models.Currency, error) {
	if currency == service.BackingCurrencyCode {
		return service.backingCurrency(), nil
	}
	currencyFromRepository, err := service.Repository.GetCurrency(currency, service.BackingCurrencyCode)

	if err == nil {
		if currencyFromRepository.IsUpdated() {
			return currencyFromRepository, err
		}

		currencyFromApi, err := service.ExchangeApiService.CurrentValue(currency, service.BackingCurrencyCode)

		if err != nil {
			return currencyFromRepository, nil
		}

		err = service.Repository.CreateOrUpdate(currencyFromApi)
		if err != nil {
			return currencyFromRepository, err
		}
		return currencyFromApi, nil
	} else if errors.Is(err, repositories.ErrNoDocumentFound) {
		currencyFromApi, err := service.ExchangeApiService.CurrentValue(currency, service.BackingCurrencyCode)

		if err != nil {
			return currencyFromApi, err
		}

		err = service.Repository.CreateOrUpdate(currencyFromApi)
		if err != nil {
			return currencyFromApi, err
		}
		return currencyFromApi, nil
	}
	return currencyFromRepository, err
}

func (service *CurrenciesService) ConvertFromCurrencies(amount float64, sourceCurrency, targetCurrency models.Currency) float64 {
	return amount * sourceCurrency.Value / (targetCurrency.Value)
}

func (service *CurrenciesService) backingCurrency() models.Currency {
	return models.Currency{Code: service.BackingCurrencyCode, Value: 1, BackingCurrencyCode: service.BackingCurrencyCode}
}
