package repository

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/repository/mongo"
	"github.com/joaohgf/challenge-bravo/internal/repository/redis"
	"sync"
)

type Engine struct {
	Mongo *mongo.Engine
	Redis *redis.Engine
}

// ModelBuilder interface to all domain could use the same code to
// interact with the repositories
type ModelBuilder interface {
	GetCode() string
	GetPrice() float64
	GetPriceString() string
	GetName() string
	ParseToMap() (map[string]interface{}, error)
	Validate() map[string]string
}

// NewEngine creates a new engine witch has all repositories
func NewEngine(ctx context.Context) *Engine {
	var (
		wg          = new(sync.WaitGroup)
		mongoEngine = new(mongo.Engine)
		redisEngine = new(redis.Engine)
	)
	wg.Add(2)

	// create a go routine to connect to mongo
	go func() {
		mongoEngine = mongo.NewEngine(ctx)
		wg.Done()
		return
	}()

	// createa a go routine to connect to redis
	go func() {
		redisEngine = redis.NewEngine()
		wg.Done()
		return
	}()
	wg.Wait()
	engine := &Engine{
		Mongo: mongoEngine,
		Redis: redisEngine,
	}
	return engine
}

// Close closes all repositories connections
func (e *Engine) Close(ctx context.Context) {
	// close mongo connection
	var err = e.Mongo.Close(ctx)
	if err != nil {
		panic(err)
	}
	// close all redis connections
	err = e.Redis.Close()
	if err != nil {
		panic(err)
	}
}
