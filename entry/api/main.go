package main

import (
	"github.com/schonmann/challenge-bravo/api"
	"github.com/schonmann/challenge-bravo/config"
)

func main() {
	cfg := config.Get()
	api.ServeApi(&cfg)
}
