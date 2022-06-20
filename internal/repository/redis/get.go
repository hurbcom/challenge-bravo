package redis

import (
	"github.com/go-redis/redis"
)

// GetPrice returns a price from redis
func (e *Engine) GetPrice(key string) (*float64, error) {
	var result, err = e.client.Get(key).Float64()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &result, nil
}
