package services

import (
	"api/src/models"
	"fmt"
)

type ConversionRepository interface {
	GetCurrencyByName(string) (models.Currency, error)
}

type ConversionService struct {
	repository            ConversionRepository
	currencySearchService CurrencyService
}

func NewConversionService(repository ConversionRepository, currencySearchService CurrencyService) *ConversionService {
	return &ConversionService{repository, currencySearchService}
}

func (conversionService ConversionService) ConvertCurrency(fromCurrencyParam, toCurrencyParam string, amount float64) (models.ConversionResponse, error) {

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

	fromCurrency, err := conversionService.currencySearchService.getCurrencyFromDatabase(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	toCurrency, err := conversionService.currencySearchService.getCurrencyFromDatabase(toCurrencyParam)
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
