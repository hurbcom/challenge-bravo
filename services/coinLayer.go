package services

import (
	"challenge-bravo/model"
)

const (
	coinLayerEndPoint = "http://api.coinlayer.com/api/"
)

type coinLayer struct {
	baseQuote
}

func (coinLayer *coinLayer) Initialize(key string) error {
	return coinLayer.baseQuote.initialize(key, coinLayerEndPoint+"list", coinLayer.RefreshQuotes)
}

func (coinLayer *coinLayer) RefreshQuotes() error {
	return coinLayer.refresh(coinLayerEndPoint+"live", func(latest *quoteResponse, currencies *[]*model.Currency) *[]model.Currency {
		var currenciesUpdate []model.Currency
		for k, v := range latest.Rates {
			value := v
			for _, c := range *currencies {
				if k == c.Code {
					c.Rate = &value
					currenciesUpdate = append(currenciesUpdate, *c)
					break
				}
			}
		}
		return &currenciesUpdate
	})
}
