package model

import (
	"fmt"
	"github.com/go-redis/cache/v8"
	"log"
	"time"
)

const coinLayerTimeOut = time.Hour * 8
const coinLayerEndPoint = "http://api.coinlayer.com/api/live"

type CoinLayer struct {
	key string
}

func (coinLayer *CoinLayer) Initialize(key string) error {

	// Check for empty key
	if len(key) == 0 {
		err := fmt.Errorf("empty key")
		log.Println(err)
		return err
	}

	// Save API key
	coinLayer.key = key

	// Cache warn up
	if btc, err := coinLayer.Quote("BTC"); err != nil || btc <= 0 {
		if err == nil {
			err = fmt.Errorf("invalid BTC quote: %.4f", btc)
		}
		return err
	}
	return nil
}

func (coinLayer *CoinLayer) Quote(symbol string) (float64, error) {
	var quote float64
	if err := _cache.Once(&cache.Item{
		Key:   "coinLayer." + symbol,
		Value: &quote,
		TTL:   coinLayerTimeOut,
		Do: func(*cache.Item) (interface{}, error) {

			// Retrieve all quotes
			var latest quoteResponse
			params := make(map[string]string)
			params["access_key"] = coinLayer.key
			if err := request(coinLayerEndPoint, params, &latest); err != nil || !latest.Success {
				if !latest.Success {
					err = fmt.Errorf(latest.Error.Type)
				}
				return 0, err
			}

			// Save all other values on the cache
			for k, v := range latest.Rates {
				if k != symbol {
					if err := _cache.Set(&cache.Item{
						Key:   "coinLayer." + k,
						Value: v,
						TTL:   coinLayerTimeOut,
					}); err != nil {
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
		},
	}); err != nil {
		log.Println(err)
		return 0, err
	}
	return quote, nil
}
