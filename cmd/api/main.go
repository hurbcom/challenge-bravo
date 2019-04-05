package main

import (
	"github.com/hurbcom/challenge-bravo/api"
	"github.com/hurbcom/challenge-bravo/config"
	"github.com/hurbcom/challenge-bravo/log"
)

func main() {
	log.Init()

	if err := config.InitConfig(); err != nil {
		log.Fatal(err.Error(), "worker")
	}
	api.InitAPI()
}
