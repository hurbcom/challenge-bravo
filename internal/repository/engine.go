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

// NewEngine creates a new engine witch has all repositories
func NewEngine(ctx context.Context) *Engine {
	var (
		wg          = new(sync.WaitGroup)
		mongoEngine = new(mongo.Engine)
		redisEngine = new(redis.Engine)
	)
	wg.Add(2)
	go func() {
		mongoEngine = mongo.NewEngine(ctx)
		wg.Done()
	}()

	go func() {
		redisEngine = redis.NewEngine()
		wg.Done()

	}()
	wg.Wait()
	return &Engine{
		Mongo: mongoEngine,
		Redis: redisEngine,
	}
}

func (e *Engine) Close(ctx context.Context) {
	var err = e.Mongo.Close(ctx)
	if err != nil {
		panic(err)
	}
}
