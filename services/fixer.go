package services

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"
)

const (
	fixerEndPoint = "http://data.fixer.io/api/"
)

type fixer struct {
	requestParams map[string]string
	baseQuote
}

func (fixer *fixer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = fixer.baseQuote.Initialize(key, refreshTimeout)

	// Get a list of available coins and currencies
	var currencyList listResponse
	fixer.requestParams = make(map[string]string)
	fixer.requestParams["access_key"] = fixer.key
	if err := fixer.request(fixerEndPoint+"symbols", fixer.requestParams, &currencyList); err != nil || !currencyList.Success {
		if !currencyList.Success {
			err = errors.New(strings.TrimSpace(currencyList.Error.Type + " " + currencyList.Error.Info))
			log.Println(err)
		}
		return err
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currencyList.getCurrencies()); err != nil {
		return err
	}

	// CacheContainer warm up
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
		if err := fixer.request(fixerEndPoint+"latest", fixer.requestParams, &latest); err != nil || !latest.Success {
			if !latest.Success {
				err = errors.New(strings.TrimSpace(latest.Error.Type + " " + latest.Error.Info))
			}
			return 0, err
		}

		// Obtain USD quote to rebase the quote (workaround for free plan)
		usd, exist := latest.Rates["USD"]
		if !exist {
			return 0, errors.New("USD quote not found")
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
