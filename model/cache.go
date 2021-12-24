package model

import (
	"context"
	rcache "github.com/go-redis/cache/v8"
	"github.com/go-redis/redis/v8"
	"log"
	"time"
)

const defaultCacheTime = time.Hour

// Cache variables
type Cache struct {
	cache  *rcache.Cache
	client *redis.Client
}

// Initialize BCache connection
func (cache *Cache) Initialize(connectionString string) error {

	// Parse connection string
	opt, err := redis.ParseURL(connectionString)
	if err != nil {
		log.Println(err)
		return err
	}

	// Establish a connection to the BCache server and verify the connection.
	cache.client = redis.NewClient(opt)
	if _, err = cache.client.Ping(context.Background()).Result(); err != nil {
		log.Println(err)
		return err
	}

	// Create BCache utility class
	cache.cache = rcache.New(&rcache.Options{Redis: cache.client})

	return nil
}

// Terminate BCache connections
func (cache *Cache) Terminate() {
	if err := cache.client.Close(); err != nil {
		log.Println(err)
	}
}

// Once gets an item from cache. If the key wasn't found at cache it executes Do function storing its
// result at cache and returning it to value parameter
func (cache *Cache) Once(key string, value interface{}, timeOut time.Duration, Do func() (interface{}, error)) error {
	return cache.cache.Once(&rcache.Item{
		Key:   key,
		Value: value,
		TTL:   timeOut,
		Do: func(item *rcache.Item) (interface{}, error) {
			return Do()
		},
	})
}

func (cache *Cache) Set(key string, value interface{}, timeOut time.Duration) error {
	return cache.cache.Set(&rcache.Item{
		Key:   key,
		Value: value,
		TTL:   timeOut,
	})
}
