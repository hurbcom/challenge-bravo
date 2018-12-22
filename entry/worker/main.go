package main

import (
	"github.com/schonmann/challenge-bravo/config"
	"github.com/schonmann/challenge-bravo/worker"
)

func main() {
	cfg := config.Get()
	worker.StartWorker(&cfg)
}
