package connections

import (
	"log"

	"github.com/go-redis/redis/v8"
)

// Open redis connection
func OpenRedis() *redis.Client {
	database := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "123Mudar!",
		DB:       0,
	})

	_, err := database.Ping(database.Context()).Result()
	if err != nil {
		log.Println(err)
	}

	return database
}
