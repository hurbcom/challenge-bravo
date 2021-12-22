package services

import (
	"challenge-bravo/model"
	"fmt"
	"log"
	"time"
)

const (
	currencyLayerEndPoint = "http://api.currencylayer.com/live"
)

type currencyLayer struct {
	baseQuote
}

func (currencyLayer *currencyLayer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = currencyLayer.baseQuote.Initialize(key, refreshTimeout)

	// Cache warn up
	if value, err := currencyLayer.Quote("USD"); err != nil || value != 1 {
		if err != nil {
			err = fmt.Errorf("invalid quote for USD rate %.4f", value)
		}
		return err
	}

	// Create refresh service
	currencyLayer.baseQuote.createTicker("USD", currencyLayer.Quote)
	return nil
}

func (currencyLayer *currencyLayer) Quote(symbol string) (float64, error) {

	// Avoid concurrent calls
	currencyLayer.refreshMutex.Lock()
	defer currencyLayer.refreshMutex.Unlock()

	// Quote the currency from cache or service
	var quote float64
	if err := model.BCache.Once("C."+symbol, &quote, currencyLayer.refreshTimeout, func() (interface{}, error) {

		// Retrieve most recent quotes from service
		var latest quoteResponse
		params := make(map[string]string)
		params["access_key"] = currencyLayer.key
		if err := currencyLayer.request(currencyLayerEndPoint, params, &latest); err != nil || !latest.Success {
			if !latest.Success {
				err = fmt.Errorf(latest.Error.Type)
			}
			return 0, err
		}

		// Save all other values on the cache
		for k, v := range latest.Quotes {
			key := k[3:]
			if key != symbol {
				if err := model.BCache.Set("C."+k, v, currencyLayer.refreshTimeout); err != nil {
					return 0, err
				}
			}
		}

		// Obtain currency quote
		qt, exist := latest.Quotes["USD"+symbol]
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
