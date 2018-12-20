package main

import (
	"github.com/labstack/gommon/log"
	"schonmann/challenge-bravo/api"
)

func main() {
	log.Infof("Starting server node...")
	api.ServeRoutes()
}
