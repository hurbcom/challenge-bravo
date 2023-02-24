package cache

type ExchangeRate interface {
	Set(key, value string) error
	Get(key string) (string, error)
}
