package services

import (
	"challenge-bravo/model"
	"fmt"
	"log"
	"time"
)

const (
	coinLayerEndPoint = "http://api.coinlayer.com/api/live"
)

type coinLayer struct {
	baseQuote
}

func (coinLayer *coinLayer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = coinLayer.baseQuote.Initialize(key, refreshTimeout)

	// Cache warn up
	if value, err := coinLayer.Quote("BTC"); err != nil || value <= 0 {
		if err != nil {
			err = fmt.Errorf("invalid quote for BTC rate %.4f", value)
		}
		return err
	}

	// Create refresh service
	coinLayer.baseQuote.createTicker("BTC", coinLayer.Quote)
	return nil
}

func (coinLayer *coinLayer) Quote(symbol string) (float64, error) {

	// Avoid concurrent calls
	coinLayer.refreshMutex.Lock()
	defer coinLayer.refreshMutex.Unlock()

	// Quote the currency from cache or service
	var quote float64
	if err := model.BCache.Once("Y."+symbol, &quote, coinLayer.refreshTimeout, func() (interface{}, error) {

		// Retrieve most recent quotes from service
		var latest quoteResponse
		params := make(map[string]string)
		params["access_key"] = coinLayer.key
		if err := coinLayer.request(coinLayerEndPoint, params, &latest); err != nil || !latest.Success {
			if !latest.Success {
				err = fmt.Errorf(latest.Error.Type)
			}
			return 0, err
		}

		// Save all other values on the cache
		for k, v := range latest.Rates {
			if k != symbol {
				if err := model.BCache.Set("Y."+k, v, coinLayer.refreshTimeout); err != nil {
					return 0, err
				}
			}
		}

		// Obtain currency quote
		qt, exist := latest.Rates[symbol]
		if !exist {
			return 0, fmt.Errorf("symbol not found: %s", symbol)
		}

		return qt, nil
	}); err != nil {
		log.Println(err)
		return 0, err
	}
	return quote, nil
}
