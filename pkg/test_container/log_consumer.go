package testcontainer

import (
	"log"

	"github.com/testcontainers/testcontainers-go"
)

type LogConsumer struct{}

func (g *LogConsumer) Accept(l testcontainers.Log) {
	log.Print(string(l.Content))
}
