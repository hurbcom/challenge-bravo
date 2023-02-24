package cache

import (
	"context"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
	"github.com/go-redis/redis/v8"
)

type RedisCache struct{}

var ctx = context.Background()
var client *redis.Client
var expiration time.Duration

func NewRedis(config *util.Config) (cache.Cache, error) {
	opt, err := redis.ParseURL(config.CacheURL)

	if err != nil {
		return nil, err
	}

	expiration, err = time.ParseDuration(config.CacheExpiration)

	if err != nil {
		return nil, err
	}

	client = redis.NewClient(opt)

	err = client.Ping(ctx).Err()

	return &RedisCache{}, err
}

func (*RedisCache) Close() error {
	return client.Close()
}

func (*RedisCache) Check() error {
	return client.Ping(ctx).Err()
}

func (*RedisCache) Currency() cache.Currency {
	return NewCurrency()
}

func (*RedisCache) ExchangeRate() cache.ExchangeRate {
	return NewExchangeRate()
}
