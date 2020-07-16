package coin

import (
	"fmt"
)

type DefaultService struct {
	secondary SecondaryPort
}

func (s *DefaultService) ConvertCoin(from, to string, amount int64) (*Coin, error) {
	result, err := s.secondary.QueryCurrencyQuotation(USD)
	if err != nil {
		return nil, err
	}

	fromValue, err := result.GetCurrency(from)
	if err != nil {
		return nil, err
	}

	toValue, err := result.GetCurrency(to)
	if err != nil {
		return nil, err
	}

	fmt.Println(from, fromValue)
	fmt.Println(to, toValue)

	c := &Coin{Name: to, Value: toValue}

	return c, nil
}

func NewService(secondary SecondaryPort) *DefaultService {
	return &DefaultService{secondary: secondary}
}
