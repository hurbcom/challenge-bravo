package services

import (
	"challenge-bravo/model"
	"errors"
	"log"
	"strings"
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
			err = errors.New(strings.TrimSpace(currencyList.Error.Type + " " + currencyList.Error.Info))
			log.Println(err)
		}
		return err
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currencyList.getCurrencies(), coinLayer.refreshTimeout, false, false); err != nil {
		return err
	}

	// CacheContainer warm up
	if err := coinLayer.RefreshQuotes(); err != nil {
		return err
	}

	// Create refresh service
	coinLayer.baseQuote.createTicker(coinLayer.RefreshQuotes)
	return nil
}

func (coinLayer *coinLayer) RefreshQuotes() error {

	// Avoid concurrent calls
	coinLayer.refreshMutex.Lock()
	defer coinLayer.refreshMutex.Unlock()

	// Retrieve most recent quotes from service
	var latest quoteResponse
	if err := coinLayer.request(coinLayerEndPoint+"live", coinLayer.requestParams, &latest); err != nil || !latest.Success {
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
	for k, v := range latest.Rates {
		value := v
		for _, c := range currencies {
			if k == c.Code {
				c.Rate = &value
				currenciesUpdate = append(currenciesUpdate, *c)
				break
			}
		}
	}

	// Save the list to the database and cache
	if err := model.SaveCurrencies(currenciesUpdate, coinLayer.refreshTimeout, true, true); err != nil {
		return err
	}

	return nil
}
