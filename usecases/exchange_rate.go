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

	if fromCurrency.ExchangeApi && toCurrency.ExchangeApi {
		return RateByExchangeApi(usecase, fromCurrency.Key, toCurrency.Key)
	}

	return RateByCustomQuotation(usecase, fromCurrency, toCurrency)
}

func RateByExchangeApi(usecase *exchangeRateUsecase, from string, to string) (float32, error) {
	result, err := usecase.service.GetLatestRate(from, to)
	if err != nil {
		return 0, err
	}

	if result.Rates[to] == 0 {
		return 0, errors.New("Can not find target currency rate")
	}

	return float32(result.Rates[to]), nil
}

func RateByCustomQuotation(usecase *exchangeRateUsecase, fromCurrency *models.Currency, toCurrency *models.Currency) (float32, error) {
	if toCurrency.ExchangeApi == false {
		return 0, errors.New("To currency must be converted by ExchangeApi")
	}

	if fromCurrency.CustomCurrency == "" || fromCurrency.CustomAmount == 0 {
		return 0, errors.New("from currency must have custom currency and custom amount")
	}

	return RateByExchangeApi(usecase, fromCurrency.CustomCurrency, toCurrency.Key)
}
