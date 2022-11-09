// reference: https://exchangerate.host/#/docs

package usecases

import (
	"errors"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/felipepnascimento/challenge-bravo-flp/services"
)

type exchangeRateUsecase struct {
	service services.ExchangeRateService
}

type ExchangeRateUsecase interface {
	GetCurrencyRate(fromCurrency *models.Currency, toCurrency *models.Currency) (float32, error)
}

func InitializeExchangeRateUsecase(service services.ExchangeRateService) ExchangeRateUsecase {
	return &exchangeRateUsecase{service}
}

func (usecase *exchangeRateUsecase) GetCurrencyRate(fromCurrency *models.Currency, toCurrency *models.Currency) (float32, error) {
	if fromCurrency == nil {
		return 0, errors.New("from currency cannot be nil")
	}

	if toCurrency == nil {
		return 0, errors.New("to currency cannot be nil")
	}

	result, err := usecase.service.GetLatestRate(fromCurrency, toCurrency)
	if err != nil {
		return 0, err
	}

	if result.Rates[toCurrency.Key] == 0 {
		return 0, errors.New("Can not find target currency rate")
	}

	return float32(result.Rates[toCurrency.Key]), nil
}
