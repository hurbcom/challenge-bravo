package redis

/**
  Consuming redis API.
*/

import (
	"github.com/go-redis/redis"
	"github.com/schonmann/challenge-bravo/config"
	"github.com/schonmann/challenge-bravo/util"
)

var (
	redisConfig = config.Get().Redis
	redisClient = redis.NewClient(&redis.Options{
		Addr:     util.FormatAddress(redisConfig.Host, redisConfig.Port),
		Password: redisConfig.Password,
		DB:       redisConfig.Database,
	})
)

//MSet sets pairs of keys and values to database.
func MSet(pairs ...interface{}) (string, error) {
	return redisClient.MSet(pairs...).Result()
}

//MGet gets multiple values from database.
func MGet(keys ...string) ([]interface{}, error) {
	return redisClient.MGet(keys...).Result()
}
