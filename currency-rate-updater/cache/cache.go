package cache

import (
	"github.com/go-redis/redis/v7"
	"github.com/pkg/errors"
	"strconv"
)

type cache struct {
	redisClient *redis.Client
}

func New(config Config) (Cache, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     config.Host + ":" + strconv.Itoa(config.Port),
		Password: config.Password,
		DB:       config.Database,
	})
	if _, err := client.Ping().Result(); err != nil {
		return nil, errors.Wrap(err, "fail to instance cache")
	}
	return &cache{redisClient: client}, nil
}

func (c *cache) Delete(key string) error {
	return c.redisClient.Del(key).Err()
}

func (c *cache) Set(key string, value float64) error {
	return c.redisClient.Set(key, value, 0).Err()
}

func (c *cache) Close() error {
	return c.redisClient.Close()
}
