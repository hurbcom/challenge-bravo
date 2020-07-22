package currency

type DefaultService struct {
	base          string
	exchangerates SecondaryPort
	coinbase      SecondaryPort
}

func (s *DefaultService) ConvertCurrency(from, to string, amount int64) (*Currency, error) {
	cryptoCurrency, err := s.coinbase.QueryCurrencyQuotation(s.base)
	if err != nil {
		return nil, err
	}

	paperCurrency, err := s.exchangerates.QueryCurrencyQuotation(s.base)
	if err != nil {
		return nil, err
	}

	result := make(CurrencyQuotationResult)

	for key, value := range cryptoCurrency {
		result[key] = value
	}

	for key, value := range paperCurrency {
		result[key] = value
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

	c := &Currency{Name: to, Value: convertedValue}

	return c, nil
}

func NewService(base string, coinbase, exchangerates SecondaryPort) *DefaultService {
	return &DefaultService{
		base:          base,
		coinbase:      coinbase,
		exchangerates: exchangerates,
	}
}
