package exchangerates

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type (
	ExchangeratesRatesResponseBody map[string]float64

	ExchangeratesResponseBody struct {
		Base  string                         `json:"base"`
		Date  string                         `json:"date"`
		Rates ExchangeratesRatesResponseBody `json:"rates"`
	}

	ExchangeratesResult struct {
		Name   string
		Amount float64
	}
)

func (s *Service) ListPaperRates(base string) ([]ExchangeratesResult, error) {
	u, err := url.Parse(fmt.Sprintf("%s/latest?base=%s", s.url, base))
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return nil, err
	}

	var body ExchangeratesResponseBody
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, err
	}

	result := make([]ExchangeratesResult, 0)

	for name, rate := range body.Rates {
		result = append(result, ExchangeratesResult{
			Name:   name,
			Amount: rate,
		})
	}

	return result, nil
}
