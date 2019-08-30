package main

import (
	"../app"
	"fmt"

	"github.com/challenge-bravo/currency-api-go/app/config"
)

func main() {
	var address string
	config := *config.GetConf()

	for _, c := range config.App {
		address = fmt.Sprintf("%s:%s",
			c.Address,
			c.Port)
	}

	fmt.Println(address)
	app.Initialize()
	app.Run(address)
}