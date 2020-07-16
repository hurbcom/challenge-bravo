package coin

type PrimaryPort interface {
	ConvertCoin(from, to string, amout int64) (*Coin, error)
}

type SecondaryPort interface {
	QueryCurrencyQuotation(coin string) (CurrencyQuotationResult, error)
}

type mockSecondaryPort struct {
	MockQueryCurrenryQuotation func(base string) (*CurrencyQuotationResult, error)
}

func (mock *mockSecondaryPort) QueryCoinQuota(base string) (*CurrencyQuotationResult, error) {
	if mock.MockQueryCurrenryQuotation == nil {
		return nil, nil
	}

	return mock.MockQueryCurrenryQuotation(base)
}

func MockQueryCurrencyQuotationFunc(fn func(c string) (*CurrencyQuotationResult, error)) *mockSecondaryPort {
	return &mockSecondaryPort{MockQueryCurrenryQuotation: fn}
}
