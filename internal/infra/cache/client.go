package cache

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

type CacheClient struct {
	client *redis.Client
}

func Connect(address string, password string) *CacheClient {
	client := redis.NewClient(&redis.Options{
		Addr:     address,
		Password: password,
		DB:       0,
	})

	if err := client.Ping(context.TODO()).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis")
	}

	return &CacheClient{
		client: client,
	}
}

func (cacheClient *CacheClient) Disconnect() {
	cacheClient.client.Close()
}
