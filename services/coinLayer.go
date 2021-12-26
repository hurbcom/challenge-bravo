package services

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"fmt"
	"log"
	"time"
)

const (
	coinLayerEndPoint = "http://api.coinlayer.com/api/"
)

type coinLayer struct {
	requestParams map[string]string
	baseQuote
}

func (coinLayer *coinLayer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = coinLayer.baseQuote.Initialize(key, refreshTimeout)

	// Get a list of available coins and currencies
	var currencyList listResponse
	coinLayer.requestParams = make(map[string]string)
	coinLayer.requestParams["access_key"] = coinLayer.key
	if err := coinLayer.request(coinLayerEndPoint+"list", coinLayer.requestParams, &currencyList); err != nil || !currencyList.Success {
		if !currencyList.Success {
			err = fmt.Errorf(currencyList.Error.Type)
			log.Println(err)
		}
		return err
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currencyList.getCurrencies()); err != nil {
		return err
	}

	// CacheContainer warm up
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
	if err := dao.Cache.Once("Y."+symbol, &quote, coinLayer.refreshTimeout, func() (interface{}, error) {

		// Retrieve most recent quotes from service
		var latest quoteResponse
		if err := coinLayer.request(coinLayerEndPoint+"live", coinLayer.requestParams, &latest); err != nil || !latest.Success {
			if !latest.Success {
				err = fmt.Errorf(latest.Error.Type)
			}
			return 0, err
		}

		// Save all other values on the cache
		for k, v := range latest.Rates {
			if k != symbol {
				if err := dao.Cache.Set("Y."+k, v, coinLayer.refreshTimeout); err != nil {
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
