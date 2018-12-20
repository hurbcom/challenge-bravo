package external

import (
	"fmt"
	"schonmann/challenge-bravo/config"
	"schonmann/challenge-bravo/util"
)

type RetrieveRatesStrategy interface {
	RetrieveRates() (*RatesResponse, error)
}

type RatesResponse struct {
	Timestamp int64              `json:"timestamp"`
	Base      string             `json:"base"`
	Rates     map[string]float64 `json:"rates"`
}

type OpenExchangeRatesStrategy struct{}

func (o OpenExchangeRatesStrategy) RetrieveRates() (*RatesResponse, error) {
	apiConfig := config.Get().Worker.ExternalAPIs.OpenExchangeRates
	apiUrl := fmt.Sprintf("%slatest.json?app_id=%s&show_alternative=1", apiConfig.URL, apiConfig.APIKey)
	response := RatesResponse{}
	if err := util.GetAndParseJSON(apiUrl, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

/**
  Strategy implemented to give API flexibility. Just returning
  OpenExchangeRatesStrategy for now.
*/

func GetRetrieveRatesStrategy() RetrieveRatesStrategy {
	return OpenExchangeRatesStrategy{}
}
