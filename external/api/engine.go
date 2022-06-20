package api

import (
	"os"
)

// Engine is the engine to interact with the external api
type Engine struct {
	URL string
}

// NewEngine creates a new engine to interact with the external api
func NewEngine() *Engine {
	return &Engine{
		URL: os.Getenv("COIN_API_URL"),
	}
}
