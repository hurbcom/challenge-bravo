package redis

import (
	"github.com/go-redis/redis"
	"os"
)

type Engine struct {
	client *redis.Client
}

func NewEngine() *Engine {
	return &Engine{redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})}
}
