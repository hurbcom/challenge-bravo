package redis

import (
	"github.com/go-redis/redis"
	"os"
	"strconv"
)

// Engine struct for redis
type Engine struct {
	client *redis.Client
}

// NewEngine creates a new redis engine
func NewEngine() *Engine {
	db, err := strconv.ParseInt(os.Getenv("REDIS_DB"), 10, 64)
	if err != nil {
		panic(err)
	}
	var engine = &Engine{
		client: redis.NewClient(&redis.Options{
			Addr:     os.Getenv("REDIS_ADDR"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       int(db),
		})}
	return engine
}

// Close closes all redis connections
func (e *Engine) Close() error {
	// close redis currency type db connection
	var err = e.client.Close()
	if err != nil {
		return err
	}
	return nil
}
