package services

import (
	"fmt"
	"log"
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

	// At least on currency service is required
	if len(config.CurrencyLayerKey) == 0 && len(config.CoinLayerKey) == 0 {
		err := fmt.Errorf("missing _fixer or currency layer api key")
		log.Println(err)
		return err
	}

	// Start the quote services using a random noise interval to avoid all services updates at the same time
	if len(config.FixerKey) > 0 {
		if err := qServices.fixer.Initialize(config.FixerKey); err != nil {
			return err
		}
	}

	if len(config.CurrencyLayerKey) > 0 {
		if err := qServices.currLayer.Initialize(config.CurrencyLayerKey); err != nil {
			return err
		}
	}

	if len(config.CoinLayerKey) > 0 {
		if err := qServices.cLayer.Initialize(config.CoinLayerKey); err != nil {
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
