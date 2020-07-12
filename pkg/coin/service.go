package coin

import "fmt"

type ErrCoinUnsupported struct {
	Coin string
}

func (err *ErrCoinUnsupported) Error() string {
	return fmt.Sprintf("unsupported [%s] coin", err.Coin)
}

type DefaultService struct {
	secondary SecondaryPort
}

func (s *DefaultService) ConvertCoin(from Coin, to string) (*Coin, error) {
	result, err := s.secondary.QueryCoinQuota(from.Name)
	if err != nil {
		return nil, &ErrCoinUnsupported{from.Name}
	}

	cval, ok := result[to]
	if !ok {
		return nil, &ErrCoinUnsupported{to}
	}

	c := &Coin{Name: to, Value: int64(cval)}

	return c, nil
}

func NewService(secondary SecondaryPort) *DefaultService {
	return &DefaultService{secondary: secondary}
}
