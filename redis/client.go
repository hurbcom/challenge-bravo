package redis

/**
  Redis implementation exposing pub/sub api only.
*/

import (
	"fmt"
	"github.com/go-redis/redis"
	"schonmann/challenge-bravo/config"
)

var (
	redisConfig = config.Get().Redis
	redisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisConfig.Host, redisConfig.Port),
		Password: redisConfig.Password,
		DB:       redisConfig.Database,
	})
)

func Publish(key string, message interface{}) error {
	_, err := redisClient.Publish(key, message).Result()
	return err
}

func Subscribe(keys ...string) (*redis.PubSub, error) {
	pubSub := redisClient.Subscribe(keys...)
	if _, err := pubSub.Receive(); err != nil {
		return nil, err
	}
	return pubSub, nil
}

func PSubscribe(keys ...string) (*redis.PubSub, error) {
	pubSub := redisClient.PSubscribe(keys...)
	if _, err := pubSub.Receive(); err != nil {
		return nil, err
	}
	return pubSub, nil
}
