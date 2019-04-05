package main

import (
	"github.com/hurbcom/challenge-bravo/config"
	"github.com/hurbcom/challenge-bravo/log"
	"github.com/hurbcom/challenge-bravo/worker"
)

func main() {
	log.Init()

	if err := config.InitConfig(); err != nil {
		log.Fatal(err.Error(), "worker")
	}
	worker.Run()
}
