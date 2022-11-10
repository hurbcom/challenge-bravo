package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/victorananias/challenge-bravo/helpers"
	"github.com/victorananias/challenge-bravo/models"
)

var ErrCurrencyUnavailable = errors.New("currency unavailable")

type IExchangeApiService interface {
	GetCurrency(string, string) (models.Currency, error)
}

type ExchangeApiService struct {
}

type CurrentResponse struct {
	Base      string             `json:"base"`
	Date      string             `json:"date"`
	Rates     map[string]float64 `json:"rates"`
	Success   bool               `json:"success"`
	Timestamp int                `json:"timestamp"`
}

func NewExchangeApiService() *ExchangeApiService {
	api := ExchangeApiService{}
	return &api
}

func (api *ExchangeApiService) GetCurrency(sourceCurrencyCode, targetCurrencyCode string) (models.Currency, error) {
	result := CurrentResponse{}
	url := fmt.Sprintf("%s/latest?base=%s&symbols=%s", helpers.Env.ExchangeApiUrl, sourceCurrencyCode, targetCurrencyCode)
	log.Printf("external api called at %s", url)

	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Set("apikey", helpers.Env.ExchangeApiKey)

	if err != nil {
		log.Print(err.Error())
		return models.Currency{}, errors.New("error creating external api request")
	}
	res, err := client.Do(req)
	if err != nil {
		log.Print(err.Error())
		return models.Currency{}, errors.New("error consuming external api")
	}
	if res.StatusCode == http.StatusBadRequest {
		return models.Currency{}, ErrCurrencyUnavailable
	}
	if res.Body != nil {
		defer res.Body.Close()
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Print(err.Error())
		return models.Currency{}, errors.New("error reading external api response")
	}
	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Print(err.Error())
		return models.Currency{}, errors.New("error unmarshing external api response")
	}
	log.Print(result)
	return api.apiCurrencyToCurrency(result), nil
}

func (api *ExchangeApiService) apiCurrencyToCurrency(response CurrentResponse) models.Currency {
	for rate, currency := range response.Rates {
		return models.Currency{
			Code:                response.Base,
			Value:               currency,
			BackingCurrencyCode: rate,
		}
	}
	return models.Currency{}
}
