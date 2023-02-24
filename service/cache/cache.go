package cache

type Cache interface {
	Currency() Currency
	ExchangeRate() ExchangeRate
	Check() error
	Close() error
}
