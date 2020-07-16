package rest

import (
	"strconv"

	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

type Service struct {
	coinbaseapiURL      string
	coinbaseapiKey      string
	coinbaseapiSecret   string
	exchangeratesapiURL string
}

const apiKey = "CYIRbG2bDxT4n25H"
const apiKeySecret = "Ix7WG6cCaqjJ7Dp8xR03r7YvWLdsAHCe"

func (s *Service) QueryCurrencyQuotation(cname string) (coin.CurrencyQuotationResult, error) {
	cryptos, err := s.ListCryptoRates(cname)
	if err != nil {
		return nil, err
	}

	papers, err := s.ListPaperRates(cname)
	if err != nil {
		return nil, err
	}

	result := make(coin.CurrencyQuotationResult)

	for name, currency := range cryptos {
		amount, err := strconv.ParseFloat(currency.Data.Amount, 64)
		if err != nil {
			return nil, err
		}

		result[name] = 1 / amount
	}

	for name, value := range papers.Rates {
		result[name] = value
	}

	return result, nil
}

func NewService(coinbaseapiKey, coinbaseapiSecret string) *Service {
	return &Service{
		coinbaseapiURL:      "https://api.coinbase.com",
		coinbaseapiKey:      coinbaseapiKey,
		coinbaseapiSecret:   coinbaseapiSecret,
		exchangeratesapiURL: "https://api.exchangeratesapi.io",
	}
}
