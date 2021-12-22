package services

import (
	"fmt"
	"log"
	"math/rand"
	"time"
)

var qServices services

type Config struct {
	FixerKey         string
	CurrencyLayerKey string
	CoinLayerKey     string
}

type services struct {
	fixer     fixer
	currLayer currencyLayer
	cLayer    coinLayer
}

// Init Initialize quote service clients and warms cache
func Init(config Config) error {

	if len(config.CurrencyLayerKey) == 0 && len(config.CoinLayerKey) == 0 {
		err := fmt.Errorf("missing _fixer or currency layer api key")
		log.Println(err)
		return err
	}

	if err := qServices.fixer.Initialize(config.FixerKey, time.Hour*8-(time.Second*time.Duration(rand.Intn(600)))); err != nil {
		return err
	}

	if len(config.CurrencyLayerKey) > 0 {
		if err := qServices.currLayer.Initialize(config.CurrencyLayerKey, (time.Hour*8)-(time.Second*time.Duration(rand.Intn(600)))); err != nil {
			return err
		}
	}

	if len(config.CoinLayerKey) > 0 {
		if err := qServices.cLayer.Initialize(config.CoinLayerKey, (time.Hour*8)-(time.Second*time.Duration(rand.Intn(600)))); err != nil {
			return err
		}
	}

	return nil
}

// Terminate currency quote services refresh ticker
func Terminate() {
	qServices.fixer.Terminate()
	qServices.cLayer.Terminate()
	qServices.currLayer.Terminate()
}
