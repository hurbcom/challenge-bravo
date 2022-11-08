// reference: https://exchangerate.host/#/docs

package usecases

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
)

type exchangeUsecase struct{}

type ExchangeUsecase interface {
	GetCurrencyRate(toCurrency string) (float32, error)
}

func InitializeExchangeUsecase() ExchangeUsecase {
	return &exchangeUsecase{}
}

func (usecase *exchangeUsecase) GetCurrencyRate(toCurrency string) (float32, error) {
	if toCurrency == "" {
		return 0, errors.New("to currency cannot be empty")
	}

	result, err := DoGetExchangeRate(toCurrency)
	if err != nil {
		return 0, err
	}

	if result.Rates[toCurrency] == 0 {
		return 0, errors.New("Can not find target currency rate")
	}

	return result.Rates[toCurrency], nil
}

func DoGetExchangeRate(toCurrency string) (entities.ExchangeResult, error) {
	BASE_CURRENCY := "USD"
	BASE_URL := "https://api.exchangerate.host/latest?base=%s&symbols=%s"

	client := http.Client{}
	baseUrl := fmt.Sprintf(BASE_URL, BASE_CURRENCY, toCurrency)
	request, err := http.NewRequest("GET", baseUrl, nil)
	if err != nil {
		return entities.ExchangeResult{}, errors.New("An error occurred to create new request")
	}

	resp, err := client.Do(request)
	if err != nil {
		return entities.ExchangeResult{}, errors.New("An error occurred to makes the request")
	}

	var exchangeResult entities.ExchangeResult
	json.NewDecoder(resp.Body).Decode(&exchangeResult)

	return exchangeResult, nil
}
