package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/felipepnascimento/challenge-bravo-flp/utils"
)

type exchangeRateService struct {
	httpClient utils.HTTPClient
}

type ExchangeRateService interface {
	GetLatestRate(fromCurrency *models.Currency, toCurrency *models.Currency) (*entities.ExchangeResult, error)
}

func InitializeExchangeRateService(httpClient utils.HTTPClient) ExchangeRateService {
	return &exchangeRateService{httpClient}
}

func (service *exchangeRateService) GetLatestRate(fromCurrency *models.Currency, toCurrency *models.Currency) (*entities.ExchangeResult, error) {
	BASE_URL := "https://api.exchangerate.host/latest?base=%s&symbols=%s"

	baseUrl := fmt.Sprintf(BASE_URL, fromCurrency.Key, toCurrency.Key)
	req, _ := http.NewRequest("GET", baseUrl, nil)
	resp, err := service.httpClient.Do(req)

	if err != nil {
		return nil, errors.New("An error occurred to makes the request")
	}

	var exchangeResult entities.ExchangeResult
	json.NewDecoder(resp.Body).Decode(&exchangeResult)

	return &exchangeResult, nil
}
