package aredis

import (
	"context"
	"fmt"
	"sync"

	"github.com/redis/go-redis/v9"
)

var (
	client *redis.Client
	once   sync.Once
)

func Init(address, password string) error {
	var err error
	once.Do(func() {
		client = redis.NewClient(&redis.Options{
			Addr:     address,
			Password: password,
			DB:       0,
		})

		pong, _err := client.Ping(context.Background()).Result()

		if _err != nil {
			err = _err
		} else {
			fmt.Println("Connected to Redis: ", pong)
		}
	})

	if err != nil {
		return err
	}

	return nil
}
