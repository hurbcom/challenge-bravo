package main

import (
	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
	"github.com/yagotome/challenge-bravo/worker"
)

func main() {
	price := currency.NewPrice(nil)
	conf := config.Load()
	worker.Run(price, conf)
}
