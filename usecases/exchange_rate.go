// reference: https://exchangerate.host/#/docs

package usecases

import (
	"errors"

	"github.com/felipepnascimento/challenge-bravo-flp/services"
)

type exchangeRateUsecase struct {
	service services.ExchangeRateService
}

type ExchangeRateUsecase interface {
	GetCurrencyRate(fromCurrency string, toCurrency string) (float32, error)
}

func InitializeExchangeRateUsecase(service services.ExchangeRateService) ExchangeRateUsecase {
	return &exchangeRateUsecase{service}
}

func (usecase *exchangeRateUsecase) GetCurrencyRate(fromCurrency string, toCurrency string) (float32, error) {
	if fromCurrency == "" {
		return 0, errors.New("from currency cannot be empty")
	}

	if toCurrency == "" {
		return 0, errors.New("to currency cannot be empty")
	}

	result, err := usecase.service.GetLatestRate(fromCurrency, toCurrency)
	if err != nil {
		return 0, err
	}

	if result.Rates[toCurrency] == 0 {
		return 0, errors.New("Can not find target currency rate")
	}

	return float32(result.Rates[toCurrency]), nil
}
