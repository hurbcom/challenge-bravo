package coin

import "fmt"

const (
	USD = "USD"
	BRL = "BRL"
	EUR = "EUR"
	BTC = "BTC"
	ETH = "ETH"
)

type ErrQueryCoinQuota struct{}

func (err *ErrQueryCoinQuota) Error() string {
	return ""
}

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
	result, err := s.secondary.QueryCoinQuota(from)
	if err != nil {
		return nil, &ErrQueryCoinQuota{}
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
