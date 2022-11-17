package services

import (
	"api/src/models"
	"fmt"
)

type SearchConversionService interface {
	IsAllowedCurrency(string) (bool, error)
	GetCurrencyFromDatabase(string) (models.Currency, error)
}

type ConversionService struct {
	SearchService SearchConversionService
}

func NewConversionService(searchService SearchService) *ConversionService {
	return &ConversionService{searchService}
}

func (conversionService ConversionService) ConvertCurrency(fromCurrencyParam, toCurrencyParam string, amount float64) (models.ConversionResponse, error) {

	isFromCurrencyAllowed, err := conversionService.SearchService.IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	if !isFromCurrencyAllowed {
		message := fmt.Errorf("currency %s not allowed", fromCurrencyParam)
		return models.ConversionResponse{}, message
	}

	isToCurrencyAllowed, err := conversionService.SearchService.IsAllowedCurrency(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	if !isToCurrencyAllowed {
		message := fmt.Errorf("currency %s not allowed", fromCurrencyParam)
		return models.ConversionResponse{}, message
	}

	fromCurrency, err := conversionService.SearchService.GetCurrencyFromDatabase(fromCurrencyParam)
	if err != nil {
		return models.ConversionResponse{}, err
	}

	toCurrency, err := conversionService.SearchService.GetCurrencyFromDatabase(toCurrencyParam)
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
