package mock

import "github.com/hurbcom/challenge-bravo/pkg/coin"

type Service struct {
	result coin.CurrencyQuotationResult
}

func (s *Service) QueryCurrencyQuotation(base string) (coin.CurrencyQuotationResult, error) {
	return s.result, nil
}

func NewService(result coin.CurrencyQuotationResult) Service {
	return Service{result: result}
}
