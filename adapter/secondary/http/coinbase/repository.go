package coinbase

import "github.com/hurbcom/challenge-bravo/pkg/currency"

type Service struct {
	url    string
	key    string
	secret string
}

func (s *Service) QueryCurrencyQuotation(base string) (currency.CurrencyQuotationResult, error) {
	rates, err := s.ListCryptoRates(base)
	if err != nil {
		return nil, err
	}

	result := make(currency.CurrencyQuotationResult)

	for _, curr := range rates {
		result[curr.Name] = 1 / curr.Amount // Get currency amount from currency base amount (1)
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
