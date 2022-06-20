package api

import (
	"os"
)

type Engine struct {
	URL string
}

func NewEngine() *Engine {
	return &Engine{
		URL: os.Getenv("COIN_API_URL"),
	}
}
