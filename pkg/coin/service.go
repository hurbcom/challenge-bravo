package coin

type DefaultService struct {
	base      string
	secondary SecondaryPort
}

func (s *DefaultService) ConvertCoin(from, to string, amount int64) (*Coin, error) {
	result, err := s.secondary.QueryCurrencyQuotation(s.base)
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

	convertedValue := (toValue / fromValue) * float64(amount)

	c := &Coin{Name: to, Value: convertedValue}

	return c, nil
}

func NewService(base string, secondary SecondaryPort) *DefaultService {
	return &DefaultService{base: base, secondary: secondary}
}
