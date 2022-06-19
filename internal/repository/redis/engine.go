package redis

import (
	"github.com/go-redis/redis"
	"os"
)

// Engine struct for redis
type Engine struct {
	clientCurrency     *redis.Client
	clientCurrencyType *redis.Client
}

// NewEngine creates a new redis engine
func NewEngine() *Engine {
	var engine = &Engine{
		clientCurrency: redis.NewClient(&redis.Options{
			Addr:     os.Getenv("REDIS_ADDR"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       0}),
		clientCurrencyType: redis.NewClient(&redis.Options{
			Addr:     os.Getenv("REDIS_ADDR"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       1}),
	}
	return engine
}

// Close closes all redis connections
func (e *Engine) Close() error {
	// close redis currency db connection
	var err = e.clientCurrency.Close()
	if err != nil {
		return err
	}
	// close redis currency type db connection
	err = e.clientCurrencyType.Close()
	if err != nil {
		return err
	}
	return nil
}

// HasCurrency checks if the currency db has been populated
func (e *Engine) HasCurrency() bool {
	return e.clientCurrency.DBSize().Val() > 0
}

// HasType checks if the currency type db has been populated
func (e *Engine) HasType() bool {
	return e.clientCurrencyType.DBSize().Val() > 0
}
