package repository

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository/mongo"
	"github.com/joaohgf/challenge-bravo/internal/repository/redis"
	"sync"
)

type Engine struct {
	Mongo *mongo.Engine
	Redis *redis.Engine
}

// NewEngine creates a new engine witch has all repositories
func NewEngine(ctx context.Context) *Engine {
	var (
		wg          = new(sync.WaitGroup)
		mongoEngine = new(mongo.Engine)
		redisEngine = new(redis.Engine)
		err         error
	)
	wg.Add(2)

	// create a go routine to connect to mongo
	go func() {
		mongoEngine, err = mongo.NewEngine(ctx)
		if err != nil {
			panic(fmt.Errorf("error creating mongo engine: %v", err))
		}
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
	return &Engine{
		Mongo: mongoEngine,
		Redis: redisEngine,
	}
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
