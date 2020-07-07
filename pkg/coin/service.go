package coin

type Service interface {
	ConvertCoin(from, to Coin) (*Coin, error)
}

type DefaultService struct{}

func (_ *DefaultService) ConvertCoin(from, to Coin) (*Coin, error) {
	return nil, nil
}
