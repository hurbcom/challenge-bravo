package services

import (
	"challenge-bravo/model"
)

const (
	currencyLayerEndPoint = "http://api.currencylayer.com/"
)

type currencyLayer struct {
	baseQuote
}

func (currencyLayer *currencyLayer) Initialize(key string) error {
	return currencyLayer.initialize(key, currencyLayerEndPoint+"list", currencyLayer.RefreshQuotes)
}

func (currencyLayer *currencyLayer) RefreshQuotes() error {
	return currencyLayer.refresh(currencyLayerEndPoint+"live", func(latest *quoteResponse, currencies *[]*model.Currency) *[]model.Currency {
		var currenciesUpdate []model.Currency
		for k, v := range latest.Quotes {
			value := v
			key := k[3:]
			for _, c := range *currencies {
				if key == c.Code {
					c.Rate = &value
					currenciesUpdate = append(currenciesUpdate, *c)
					break
				}
			}
		}
		return &currenciesUpdate
	})
}
