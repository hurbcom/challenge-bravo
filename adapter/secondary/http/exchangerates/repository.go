package exchangerates

import "github.com/hurbcom/challenge-bravo/pkg/currency"

type Service struct {
	url string
}

func (s *Service) QueryCurrencyQuotation(base string) (currency.CurrencyQuotationResult, error) {
	papers, err := s.ListPaperRates(base)
	if err != nil {
		return nil, err
	}

	result := make(currency.CurrencyQuotationResult)

	for _, currency := range papers {
		result[currency.Name] = currency.Amount
	}

	return result, nil
}

func NewService(url string) *Service {
	return &Service{url: url}
}
