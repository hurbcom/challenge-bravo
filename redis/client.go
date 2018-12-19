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
	_, err := pubSub.Receive()
	return pubSub, err
}

func PSubscribe(keys ...string) (*redis.PubSub, error) {
	pubSub := redisClient.PSubscribe(keys...)
	_, err := pubSub.Receive()
	return pubSub, err
}
