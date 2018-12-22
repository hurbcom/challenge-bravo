package strategy

import (
	"fmt"
	"github.com/schonmann/challenge-bravo/config"
	"github.com/schonmann/challenge-bravo/util"
)

/**
  Strategy implemented to give flexibility over
  APIs used for currency rates retrieving.
*/

type RetrieveQuotasStrategy interface {
	RetrieveRates() (*QuotasResponse, error)
}

type QuotasResponse struct {
	Timestamp int64              `json:"timestamp"`
	Base      string             `json:"base"`
	Quotas    map[string]float64 `json:"rates"`
}

type OpenExchangeRatesStrategy struct{}

func (o OpenExchangeRatesStrategy) RetrieveRates() (*QuotasResponse, error) {
	apiConfig := config.Get().Worker.ExternalAPIs.OpenExchangeRates

	apiUrl := fmt.Sprintf("%slatest.json?app_id=%s&show_alternative=1&base=%s",
		apiConfig.URL, apiConfig.APIKey, config.Get().BaseCurrency)

	response := QuotasResponse{}
	if err := util.GetAndParseJSON(apiUrl, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

type FixerStrategy struct{}

func (o FixerStrategy) RetrieveRates() (*QuotasResponse, error) {
	apiConfig := config.Get().Worker.ExternalAPIs.Fixer

	apiUrl := fmt.Sprintf("%slatest?access_key=%s&base=%s",
		apiConfig.URL, apiConfig.APIKey, config.Get().BaseCurrency)

	response := QuotasResponse{}
	if err := util.GetAndParseJSON(apiUrl, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

//GetRetrieveQuotasStrategy returns the configured strategy.
func GetRetrieveQuotasStrategy() RetrieveQuotasStrategy {
	return OpenExchangeRatesStrategy{}
}
