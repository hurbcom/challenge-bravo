package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/settings"
)

var (
	server Server
	routes Routes
)

func main() {
	_, err := settings.NewSettings()
	if err != nil {
		log.Fatalf("couldn't load settings")
	}
	routes.RegisterAll()
	server.Start()
}
