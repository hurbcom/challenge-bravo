package redis

import (
	"github.com/go-redis/redis"
	"time"
)

// GetPrice returns a price from redis
func (e *Engine) GetPrice(key string) (*float64, error) {
	var result, err = e.clientCurrency.Get(key).Float64()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &result, nil
}

// GetTTl returns the ttl of price from redis
func (e *Engine) GetTTl(key string) (*time.Duration, error) {
	var result, err = e.clientCurrency.TTL(key).Result()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &result, nil

}

// GetType returns a price type from redis
func (e *Engine) GetType(key string) (string, error) {
	var result, err = e.clientCurrencyType.Get(key).Result()
	if err == redis.Nil {
		return "", nil
	}
	if err != nil {
		return "", err
	}
	return result, nil
}
