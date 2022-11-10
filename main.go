package main

import (
	"log"

	"github.com/victorananias/challenge-bravo/helpers"
)

var (
	server Server
	routes Routes
)

func main() {
	err := helpers.LoadEnv()
	if err != nil {
		log.Fatalf("could not load settings %s", err.Error())
	}
	routes.RegisterAll()
	server.Start()
}
