package services

import (
	"challenge-bravo/model"
	"errors"
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
	if err := model.SaveCurrencies(currencyList.getCurrencies(), fixer.refreshTimeout, false, false); err != nil {
		return err
	}

	// CacheContainer warm up
	if err := fixer.RefreshQuotes(); err != nil {
		return err
	}

	// Create refresh service
	fixer.baseQuote.createTicker(fixer.RefreshQuotes)
	return nil
}

func (fixer *fixer) RefreshQuotes() error {

	// Avoid concurrent calls
	fixer.refreshMutex.Lock()
	defer fixer.refreshMutex.Unlock()

	// Retrieve most recent quotes from service
	var latest quoteResponse
	if err := fixer.request(fixerEndPoint+"latest", fixer.requestParams, &latest); err != nil || !latest.Success {
		if !latest.Success {
			err = errors.New(strings.TrimSpace(latest.Error.Type + " " + latest.Error.Info))
		}
		return err
	}

	// Retrieve the currency list from database
	var currencies []*model.Currency
	currency := model.Currency{}
	if err := currency.List(&currencies); err != nil {
		return err
	}

	// Obtain USD quote to rebase the quote (workaround for free plan, once fixer return to EUR)
	usd, exist := latest.Rates["USD"]
	if !exist {
		return errors.New("USD quote not found")
	}

	// Save values to database and cache
	var currenciesUpdate []model.Currency
	for k, v := range latest.Rates {
		val := v / usd
		for _, c := range currencies {
			if k == c.Code {
				c.Rate = &val
				currenciesUpdate = append(currenciesUpdate, *c)
				break
			}
		}
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currenciesUpdate, fixer.refreshTimeout, true, true); err != nil {
		return err
	}

	return nil
}
