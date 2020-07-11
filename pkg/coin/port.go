package coin

type PrimaryPort interface {
	ConvertCoin(from Coin, to string) (*Coin, error)
}

type SecondaryPort interface {
	QueryCoinQuota(c Coin) (CoinQuotaResult, error)
}
