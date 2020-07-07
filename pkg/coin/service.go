package coin

type Service interface {
	ConvertCoin(from Coin, to string) (*Coin, error)
}

type DefaultService struct{}

func (_ *DefaultService) ConvertCoin(from Coin, to string) (*Coin, error) {
	return &Coin{Name: "USD", Amount: 1}, nil
}
