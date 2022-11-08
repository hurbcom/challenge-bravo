package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"
)

type exchangeRateService struct {
	httpClient utils.HTTPClient
}

type ExchangeRateService interface {
	GetLatestRate(toCurrency string) (*entities.ExchangeResult, error)
}

func InitializeExchangeRateService(httpClient utils.HTTPClient) ExchangeRateService {
	return &exchangeRateService{httpClient}
}

func (service *exchangeRateService) GetLatestRate(toCurrency string) (*entities.ExchangeResult, error) {
	BASE_CURRENCY := "USD"
	BASE_URL := "https://api.exchangerate.host/latest?base=%s&symbols=%s"

	baseUrl := fmt.Sprintf(BASE_URL, BASE_CURRENCY, toCurrency)
	req, _ := http.NewRequest("GET", baseUrl, nil)
	resp, err := service.httpClient.Do(req)

	if err != nil {
		return nil, errors.New("An error occurred to makes the request")
	}

	var exchangeResult entities.ExchangeResult
	json.NewDecoder(resp.Body).Decode(&exchangeResult)

	return &exchangeResult, nil
}
