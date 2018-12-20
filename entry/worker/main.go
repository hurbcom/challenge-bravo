package main

import (
	"github.com/labstack/gommon/log"
	"schonmann/challenge-bravo/worker"
)

func main() {
	log.Infof("Starting worker node...")
	worker.StartWorker()
}
