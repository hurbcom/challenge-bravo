package dao

import (
	"context"
	rcache "github.com/go-redis/cache/v8"
	"github.com/go-redis/redis/v8"
	"log"
	"time"
)

const DefaultCacheTime = time.Hour

// CacheContainer variables
type CacheContainer struct {
	cache  *rcache.Cache
	client *redis.Client
}

// Initialize Cache connection
func (cache *CacheContainer) Initialize(connectionString string) error {

	// Parse connection string
	opt, err := redis.ParseURL(connectionString)
	if err != nil {
		log.Println(err)
		return err
	}

	// Establish a connection to the Cache server and verify the connection.
	cache.client = redis.NewClient(opt)
	if _, err = cache.client.Ping(context.Background()).Result(); err != nil {
		log.Println(err)
		return err
	}

	// Create Cache utility class
	cache.cache = rcache.New(&rcache.Options{Redis: cache.client})

	return nil
}

// Terminate Cache connections
func (cache *CacheContainer) Terminate() {
	if err := cache.client.Close(); err != nil {
		log.Println(err)
	}
}

// Once gets an item from cache. If the key wasn't found at cache it executes Do function storing its
// result at cache and returning it to value parameter
func (cache *CacheContainer) Once(key string, value interface{}, timeOut time.Duration, Do func() (interface{}, error)) error {
	return cache.cache.Once(&rcache.Item{
		Key:   key,
		Value: value,
		TTL:   timeOut,
		Do: func(item *rcache.Item) (interface{}, error) {
			return Do()
		},
	})
}

// Set puts an item on cache by a given duration. If the key already exists it will be replaced
func (cache *CacheContainer) Set(key string, value interface{}, timeOut time.Duration) error {
	return cache.cache.Set(&rcache.Item{
		Key:   key,
		Value: value,
		TTL:   timeOut,
	})
}

// Del Deletes a key from the cache
func (cache *CacheContainer) Del(key string) error {
	return cache.cache.Delete(context.Background(), key)
}

// Get retrieves a key from the cache
func (cache *CacheContainer) Get(key string, value interface{}) error {
	return cache.cache.Get(context.Background(), key, value)
}
