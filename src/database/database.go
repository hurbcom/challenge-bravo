package database

import (
	"challenge-bravo/src/config"

	"github.com/go-redis/redis"
)

func Connect() *redis.Client {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     config.DBAddr,
		Password: config.DBPass,
		DB:       0,
	})

	return redisClient
}
