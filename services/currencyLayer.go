package services

import (
	"challenge-bravo/model"
	"errors"
	"log"
	"strings"
	"time"
)

const (
	currencyLayerEndPoint = "http://api.currencylayer.com/"
)

type currencyLayer struct {
	requestParams map[string]string
	baseQuote
}

func (currencyLayer *currencyLayer) Initialize(key string, refreshTimeout time.Duration) error {

	// Common initialization procedures
	_ = currencyLayer.baseQuote.Initialize(key, refreshTimeout)

	// Get a list of available coins and currencies
	var currencyList listResponse
	currencyLayer.requestParams = make(map[string]string)
	currencyLayer.requestParams["access_key"] = currencyLayer.key
	if err := currencyLayer.request(currencyLayerEndPoint+"list", currencyLayer.requestParams, &currencyList); err != nil || !currencyList.Success {
		if !currencyList.Success {
			err = errors.New(strings.TrimSpace(currencyList.Error.Type + " " + currencyList.Error.Info))
			log.Println(err)
		}
		return err
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currencyList.getCurrencies(), currencyLayer.refreshTimeout, false, false); err != nil {
		return err
	}

	// CacheContainer warm up
	if err := currencyLayer.RefreshQuotes(); err != nil {
		return err
	}

	// Create refresh service
	currencyLayer.baseQuote.createTicker(currencyLayer.RefreshQuotes)
	return nil
}

func (currencyLayer *currencyLayer) RefreshQuotes() error {

	// Avoid concurrent calls
	currencyLayer.refreshMutex.Lock()
	defer currencyLayer.refreshMutex.Unlock()

	// Retrieve most recent quotes from service
	var latest quoteResponse
	if err := currencyLayer.request(currencyLayerEndPoint+"live", currencyLayer.requestParams, &latest); err != nil || !latest.Success {
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

	// Save values to database and cache
	var currenciesUpdate []model.Currency
	for k, v := range latest.Quotes {
		value := v
		key := k[3:]
		for _, c := range currencies {
			if key == c.Code {
				c.Rate = &value
				currenciesUpdate = append(currenciesUpdate, *c)
				break
			}
		}
	}
	// Save the list to the database and cache
	if err := model.SaveCurrencies(currenciesUpdate, currencyLayer.refreshTimeout, true, true); err != nil {
		return err
	}

	return nil
}
