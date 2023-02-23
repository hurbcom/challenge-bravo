package cache

type Cache interface {
	Currency() Currency
	Check() error
	Close() error
}
