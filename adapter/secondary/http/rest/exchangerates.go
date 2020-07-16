package rest

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type (
	ExchangeratesRatesResponse map[string]float64

	ExchangeratesResponse struct {
		Base  string                     `json:"base"`
		Date  string                     `json:"date"`
		Rates ExchangeratesRatesResponse `json:"rates"`
	}
)

func (s *Service) ListPaperRates(base string) (*ExchangeratesResponse, error) {
	u, err := url.Parse(fmt.Sprintf("%s/latest?base=%s", s.exchangeratesapiURL, base))
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return nil, err
	}

	var result ExchangeratesResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
