package repositories

import (
	"time"

	"github.com/go-redis/redis"
)

// RedisStorage holder
type RedisStorage struct {
	Redis *redis.Client
}

func NewRedisStorage() *RedisStorage {
	return &RedisStorage{}
}

// Connect to redis instance
func (s *RedisStorage) Connect() error {
	client := redis.NewClient(&redis.Options{
		Addr:     "0.0.0.0:6379",
		Password: "",
		DB:       0,
	})

	_, err := client.Ping().Result()

	if err != nil {
		panic("Failed to connect to redis")
	}

	s.Redis = client

	return err
}

// FindIfPresent check if the converted value is in the cache list
func (s *RedisStorage) FindIfPresent(symbol string) float64 {
	val, err := s.Redis.Get(symbol).Float64()

	if err != nil {
		return 0
	}

	return val
}

// IsAllowed check if the currency is in the allowed list
func (s *RedisStorage) IsAllowed(symbol string) bool {
	return s.Redis.SIsMember("allowed", symbol).Val()
}

// RemoveFromAllowedList removes a currency from the allowed list
func (s *RedisStorage) RemoveFromAllowedList(symbol string) error {
	return s.Redis.SRem("allowed", symbol).Err()
}

// AddToCacheList adds a converted value to cache, with expire time of one day
func (s *RedisStorage) AddToCacheList(symbol string, value float64) error {
	return s.Redis.Set(symbol, value, time.Hour*24).Err()
}

// AddToAllowedList adds a currency to the allowed list
func (s *RedisStorage) AddToAllowedList(symbol string) error {
	return s.Redis.SAdd("allowed", symbol).Err()
}
