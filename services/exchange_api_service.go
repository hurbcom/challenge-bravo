package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/settings"
)

var ErrCurrencyUnavailable = errors.New("currency unavailable")

type IExchangeApiService interface {
	CurrentValue(string, string) (models.Currency, error)
}

type ExchangeApiService struct {
	settings *settings.Settings
}

type CurrentResponse struct {
	Base       string             `json:"base"`
	Date       time.Time          `json:"date"`
	Currencies map[string]float64 `json:"currencies"`
	Success    bool               `json:"success"`
	Timestamp  int                `json:"timestamp"`
}

func NewExchangeApiService() *ExchangeApiService {
	api := ExchangeApiService{}
	settings, err := settings.NewSettings()
	if err != nil {
		log.Fatalf("no settings found")
	}
	api.settings = settings
	return &api
}

func (api *ExchangeApiService) CurrentValue(sourceCurrencyCode, targetCurrencyCode string) (models.Currency, error) {
	result := CurrentResponse{}
	url := fmt.Sprintf("%s/latest?base=%s&symbols=%s", api.settings.ApiUrl, sourceCurrencyCode, targetCurrencyCode)
	log.Printf("external api called at %s", url)

	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	req.Header.Set("apikey", api.settings.ApiKey)

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
	return api.currentResponseToCurrency(result, targetCurrencyCode), nil
}

func (api *ExchangeApiService) currentResponseToCurrency(response CurrentResponse, targetCurrencyCode string) models.Currency {
	return models.Currency{
		Code:                response.Base,
		Value:               response.Currencies[targetCurrencyCode],
		BackingCurrencyCode: targetCurrencyCode,
	}
}
