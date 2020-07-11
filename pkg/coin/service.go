package coin

import (
	"errors"
)

const (
	USD = "USD"
	BRL = "BRL"
	EUR = "EUR"
	BTC = "BTC"
	ETH = "ETH"
)

type DefaultService struct {
	secondary SecondaryPort
}

func (s *DefaultService) ConvertCoin(from Coin, to string) (*Coin, error) {
	result, err := s.secondary.QueryCoinQuota(from)
	if err != nil {
		return nil, err
	}

	cval, ok := result[to]
	if !ok {
		return nil, errors.New("test")
	}

	c := &Coin{Name: to, Value: int64(cval)}

	return c, nil
}

func NewService(secondary SecondaryPort) *DefaultService {
	return &DefaultService{secondary: secondary}
}
