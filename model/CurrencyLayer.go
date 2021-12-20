package model

import (
	"fmt"
	"github.com/go-redis/cache/v8"
	"log"
	"time"
)

const currencyLayerTimeOut = time.Hour * 8
const currencyLayerEndPoint = "http://api.currencylayer.com/live"

type CurrencyLayer struct {
	key string
}

func (currencyLayer *CurrencyLayer) Initialize(key string) error {

	// Check for empty key
	if len(key) == 0 {
		err := fmt.Errorf("empty key")
		log.Println(err)
		return err
	}

	// Save API key
	currencyLayer.key = key

	// Cache warn up
	if usd, err := currencyLayer.Quote("USD"); err != nil || usd != 1 {
		if err == nil {
			err = fmt.Errorf("invalid USD quote: %.4f", usd)
		}
		return err
	}
	return nil
}

func (currencyLayer *CurrencyLayer) Quote(symbol string) (float64, error) {
	var quote float64
	if err := _cache.Once(&cache.Item{
		Key:   "cur." + symbol,
		Value: &quote,
		TTL:   currencyLayerTimeOut,
		Do: func(*cache.Item) (interface{}, error) {

			// Retrieve all quotes
			var latest quoteResponse
			params := make(map[string]string)
			params["access_key"] = currencyLayer.key
			if err := request(currencyLayerEndPoint, params, &latest); err != nil || !latest.Success {
				if !latest.Success {
					err = fmt.Errorf(latest.Error.Type)
				}
				return 0, err
			}

			// Save all other values on the cache
			for k, v := range latest.Quotes {
				key := k[3:]
				if key != symbol {
					if err := _cache.Set(&cache.Item{
						Key:   "cur." + key,
						Value: v,
						TTL:   currencyLayerTimeOut,
					}); err != nil {
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
		},
	}); err != nil {
		log.Println(err)
		return 0, err
	}
	return quote, nil
}
