package cache

type Cache interface {
	Delete(key string) error
	Set(key string, value float64) error
	Close() error
}
