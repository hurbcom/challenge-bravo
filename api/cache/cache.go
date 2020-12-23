package cache

import (
	"github.com/go-redis/redis/v7"
	"github.com/pkg/errors"
	"strconv"
)

var ErrNotFound = redis.Nil

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

func (c *cache) Get(key string) (float64, error) {
	return c.redisClient.Get(key).Float64()
}

func (c *cache) Close() error {
	return c.redisClient.Close()
}
