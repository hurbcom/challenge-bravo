package rest

import "github.com/hurbcom/challenge-bravo/pkg/coin"

type Service struct {
	coinbaseapiURL      string
	coinbaseapiKey      string
	coinbaseapiSecret   string
	exchangeratesapiURL string
}

const apiKey = "CYIRbG2bDxT4n25H"
const apiKeySecret = "Ix7WG6cCaqjJ7Dp8xR03r7YvWLdsAHCe"

func (s *Service) QueryCurrencyQuotation(base string) (coin.CurrencyQuotationResult, error) {
	cryptos, err := s.ListCryptoRates(base)
	if err != nil {
		return nil, err
	}

	papers, err := s.ListPaperRates(base)
	if err != nil {
		return nil, err
	}

	result := make(coin.CurrencyQuotationResult)

	for _, currency := range cryptos {
		result[currency.Name] = 1 / currency.Amount // Get currency amount from currency base amount (1)
	}

	for _, currency := range papers {
		result[currency.Name] = currency.Amount
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
