package coin

type PrimaryPort interface {
	ConvertCoin(from Coin, to string) (*Coin, error)
}

type SecondaryPort interface {
	QueryCoinQuota(coin string) (CoinQuotaResult, error)
}

type mockSecondaryPort struct {
	MockQueryCoinQuota func(coin string) (CoinQuotaResult, error)
}

func (mock *mockSecondaryPort) QueryCoinQuota(coin string) (CoinQuotaResult, error) {
	if mock.MockQueryCoinQuota == nil {
		return CoinQuotaResult{}, nil
	}

	return mock.MockQueryCoinQuota(coin)
}

func MockQueryCoinQuotaFunc(fn func(coin string) (CoinQuotaResult, error)) *mockSecondaryPort {
	return &mockSecondaryPort{MockQueryCoinQuota: fn}
}
