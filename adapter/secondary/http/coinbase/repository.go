package coinbase

import "github.com/hurbcom/challenge-bravo/pkg/coin"

type Service struct {
	url    string
	key    string
	secret string
}

func (s *Service) QueryCurrencyQuotation(base string) (coin.CurrencyQuotationResult, error) {
	rates, err := s.ListCryptoRates(base)
	if err != nil {
		return nil, err
	}

	result := make(coin.CurrencyQuotationResult)

	for _, currency := range rates {
		result[currency.Name] = 1 / currency.Amount // Get currency amount from currency base amount (1)
	}

	return result, nil
}

func NewService(u, key, secret string) *Service {
	return &Service{
		url:    u,
		key:    key,
		secret: secret,
	}
}
