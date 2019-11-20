package usecases

// CoinAPI is an interface for any api we eventually choose. This helps with better maintainability.
type CoinAPI interface {
	RetrieveCoinValue(coin string) (float64, error)
}
