package cache

type Cache interface {
	Get(key string) (float64, error)
	Close() error
}
