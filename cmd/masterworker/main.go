package main

import (
	"sync"

	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
	"github.com/yagotome/challenge-bravo/worker/masterworker"
)

func main() {
	price := currency.NewPrice(nil)
	conf := config.Load()
	conf.LoadAPIKey()

	wgFirstUpdate := &sync.WaitGroup{}
	wgFirstUpdate.Add(1)
	go masterworker.Run(price, conf, wgFirstUpdate)
	wgFirstUpdate.Wait()

	masterworker.Serve(price, conf)
}
