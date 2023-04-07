package cache

import (
	"context"
	"fmt"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"github.com/go-redis/redis/v8"
	"time"
)

const (
	CACHE_HOST_ENV_VAR     = "CACHE_HOST"
	CACHE_PASSWORD_ENV_VAR = "CACHE_PASSWORD"
	CACHE_PORT_ENV_VAR     = "CACHE_PORT"
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

	host, err := environment.Get(CACHE_HOST_ENV_VAR)
	if err != nil {
		return nil, err
	}

	port, err := environment.Get(CACHE_PORT_ENV_VAR)
	if err != nil {
		return nil, err
	}

	password, err := environment.Get(CACHE_PASSWORD_ENV_VAR)
	if err != nil {
		return nil, err
	}

	redis := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Password: password,
	})

	return redis, nil
}
