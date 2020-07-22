package currency

type PrimaryPort interface {
	ConvertCurrency(from, to string, amout int64) (*Currency, error)
}

type SecondaryPort interface {
	QueryCurrencyQuotation(base string) (CurrencyQuotationResult, error)
}

type mockSecondaryPort struct {
	mockQueryCurrencyQuotation func(base string) (CurrencyQuotationResult, error)
}

func (mock *mockSecondaryPort) QueryCurrencyQuotation(base string) (CurrencyQuotationResult, error) {
	if mock.mockQueryCurrencyQuotation == nil {
		return nil, nil
	}

	return mock.mockQueryCurrencyQuotation(base)
}

func MockQueryCurrencyQuotationFunc(fn func(base string) (CurrencyQuotationResult, error)) *mockSecondaryPort {
	return &mockSecondaryPort{mockQueryCurrencyQuotation: fn}
}
