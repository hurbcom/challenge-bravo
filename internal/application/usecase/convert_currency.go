package usecase

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
)

type ConvertedCurrencyResponse struct {
	From  string  `json:"from"`
	To    string  `json:"to"`
	Value float64 `json:"value"`
}

type ConvertCurrencyUseCase struct {
	dynamicCurrencyStrategy  entity.CurrencyStrategy
	officialCurrencyStrategy entity.CurrencyStrategy
	officialCurrencies       []string
}

func NewConvertCurrencyUseCase(dynamicCurrencyStrategy entity.CurrencyStrategy, officialCurrencyStrategy entity.CurrencyStrategy, officialCurrencies []string) *ConvertCurrencyUseCase {
	return &ConvertCurrencyUseCase{
		dynamicCurrencyStrategy:  dynamicCurrencyStrategy,
		officialCurrencyStrategy: officialCurrencyStrategy,
		officialCurrencies:       officialCurrencies,
	}
}

func (convertCurrencyUseCase *ConvertCurrencyUseCase) ConvertCurrency(from, to string, amount float64) (*ConvertedCurrencyResponse, error) {
	fromCurrency, toCurrency := &entity.Currency{
		Name: from,
	}, &entity.Currency{
		Name: to,
	}

	fromCurrency, toCurrency, err := convertCurrencyUseCase.handleAsyncRequest(fromCurrency, toCurrency)
	if err != nil {
		return nil, err
	}

	convertedAmount := (amount * fromCurrency.Rate) / toCurrency.Rate

	return &ConvertedCurrencyResponse{
		From:  fromCurrency.Name,
		To:    toCurrency.Name,
		Value: convertedAmount,
	}, nil
}

func (convertCurrencyUseCase *ConvertCurrencyUseCase) handleAsyncRequest(fromCurrency, toCurrency *entity.Currency) (*entity.Currency, *entity.Currency, error) {
	currencyChannel := make(chan *entity.Currency, 2)
	errorChannel := make(chan error)
	go convertCurrencyUseCase.getCurrencyAsync(fromCurrency, currencyChannel, errorChannel)
	go convertCurrencyUseCase.getCurrencyAsync(toCurrency, currencyChannel, errorChannel)

	var responseCurrencies [2]*entity.Currency
	index := 0

	for index < 2 {
		select {
		case currency := <-currencyChannel:
			responseCurrencies[index] = currency
			index++
		case err := <-errorChannel:
			fmt.Println(err)
			return nil, nil, err
		}
	}

	if responseCurrencies[0].Name == fromCurrency.Name {
		return responseCurrencies[0], responseCurrencies[1], nil
	}

	return responseCurrencies[1], responseCurrencies[0], nil
}

func (convertCurrencyUseCase *ConvertCurrencyUseCase) getCurrencyAsync(currency *entity.Currency, currencyChannel chan *entity.Currency, errorChannel chan error) {
	currency, err := convertCurrencyUseCase.getAccurateStrategy(currency).GetCurrency(currency.Name)
	if err != nil {
		errorChannel <- err
		return
	}

	currencyChannel <- currency
}

func (convertCurrencyUseCase *ConvertCurrencyUseCase) getAccurateStrategy(currency *entity.Currency) entity.CurrencyStrategy {
	if currency.IsOfficialCurrency(convertCurrencyUseCase.officialCurrencies) {
		return convertCurrencyUseCase.officialCurrencyStrategy
	}

	return convertCurrencyUseCase.dynamicCurrencyStrategy
}
