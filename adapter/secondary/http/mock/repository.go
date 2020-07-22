package mock

import "github.com/hurbcom/challenge-bravo/pkg/currency"

type Service struct {
	result currency.CurrencyQuotationResult
}

func (s *Service) QueryCurrencyQuotation(base string) (currency.CurrencyQuotationResult, error) {
	return s.result, nil
}

func NewService(result currency.CurrencyQuotationResult) Service {
	return Service{result: result}
}
