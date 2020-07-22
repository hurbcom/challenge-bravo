package exchangerates

import "github.com/hurbcom/challenge-bravo/pkg/coin"

type Service struct {
	url string
}

func (s *Service) QueryCurrencyQuotation(base string) (coin.CurrencyQuotationResult, error) {
	papers, err := s.ListPaperRates(base)
	if err != nil {
		return nil, err
	}

	result := make(coin.CurrencyQuotationResult)

	for _, currency := range papers {
		result[currency.Name] = currency.Amount
	}

	return result, nil
}

func NewService(url string) *Service {
	return &Service{url: url}
}
