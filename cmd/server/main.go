package main

import (
	"sync"

	"github.com/yagotome/challenge-bravo/api"
	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
	"github.com/yagotome/challenge-bravo/worker"
)

func main() {
	price := currency.NewPrice(nil)
	conf := config.Load()

	wgFirstUpdate := &sync.WaitGroup{}
	wgFirstUpdate.Add(1)
	go worker.Run(price, conf, wgFirstUpdate)
	wgFirstUpdate.Wait()

	api.Serve(price, conf)
}
