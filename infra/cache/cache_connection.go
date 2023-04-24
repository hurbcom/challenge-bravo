package cache

import (
	"context"
	"fmt"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"github.com/go-redis/redis/v8"
	"time"
)

const (
	CacheHostEnvVar     = "CACHE_HOST"
	CachePasswordEnvVar = "CACHE_PASSWORD"
	CachePortEnvVar     = "CACHE_PORT"
)

type (
	RedisCacheConnection interface {
		Set(ctx context.Context, key string, value interface{}, expiration time.Duration) *redis.StatusCmd
		Get(ctx context.Context, key string) *redis.StringCmd
		Del(ctx context.Context, keys ...string) *redis.IntCmd
		Ping(ctx context.Context) *redis.StatusCmd
	}
)

func NewCacheConnection(environment env.Environment) (RedisCacheConnection, error) {

	host, err := environment.Get(CacheHostEnvVar)
	if err != nil {
		return nil, err
	}

	port, err := environment.Get(CachePortEnvVar)
	if err != nil {
		return nil, err
	}

	password, err := environment.Get(CachePasswordEnvVar)
	if err != nil {
		return nil, err
	}

	redis := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Password: password,
	})

	return redis, nil
}
