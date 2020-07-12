package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

type Service struct {
	url string
}

func (s *Service) QueryCoinQuota(cname string) (coin.CoinQuotaResult, error) {
	u, err := url.Parse(fmt.Sprintf("%s/latest?base=%s", s.url, cname))
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return nil, err
	}

	var body map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	rates, ok := body["rates"]
	if !ok {
		return nil, errors.New("test rates")
	}

	raw, ok := rates.(map[string]interface{})
	if !ok {
		return nil, errors.New("test cast rates")
	}

	result := make(coin.CoinQuotaResult)

	for key, val := range raw {
		if cval, ok := val.(float64); ok {
			result[key] = cval
		}
	}

	return result, nil
}

func NewService(u string) *Service {
	return &Service{url: u}
}
