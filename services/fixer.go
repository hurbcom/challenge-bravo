package services

import (
	"challenge-bravo/model/dao"
	"fmt"
	"log"
	"time"
)

const (
	fixerEndPoint = "http://data.fixer.io/api/latest"
)

type fixer struct {
	baseQuote
}

func (fixer *fixer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = fixer.baseQuote.Initialize(key, refreshTimeout)

	// CacheContainer warn up
	if value, err := fixer.Quote("USD"); err != nil || value != 1 {
		if err != nil {
			err = fmt.Errorf("invalid quote for USD rate %.4f", value)
		}
		return err
	}

	// Create refresh service
	fixer.baseQuote.createTicker("USD", fixer.Quote)
	return nil
}

func (fixer *fixer) Quote(symbol string) (float64, error) {

	// Avoid concurrent calls
	fixer.refreshMutex.Lock()
	defer fixer.refreshMutex.Unlock()

	// Quote the currency from cache or service
	var quote float64
	if err := dao.Cache.Once("C."+symbol, &quote, fixer.refreshTimeout, func() (interface{}, error) {

		// Retrieve most recent quotes from service
		var latest quoteResponse
		params := make(map[string]string)
		params["access_key"] = fixer.key
		if err := fixer.request(fixerEndPoint, params, &latest); err != nil || !latest.Success {
			if !latest.Success {
				err = fmt.Errorf(latest.Error.Type)
			}
			return 0, err
		}

		// Obtain USD quote to rebase the quote (workaround for free plan)
		usd, exist := latest.Rates["USD"]
		if !exist {
			return 0, fmt.Errorf("USD quote not found")
		}

		// Save all other values on the cache
		for k, v := range latest.Rates {
			if k != symbol {
				if err := dao.Cache.Set("C."+k, v/usd, fixer.refreshTimeout); err != nil {
					return 0, err
				}
			}
		}

		// Obtain currency quote
		qt, exist := latest.Rates[symbol]
		if !exist {
			return 0, fmt.Errorf("symbol not found: %s", symbol)
		}

		return qt / usd, nil
	}); err != nil {
		log.Println(err)
		return 0, err
	}
	return quote, nil
}
