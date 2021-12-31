package services

import (
	"challenge-bravo/model"
	"errors"
	"log"
)

const (
	fixerEndPoint = "http://data.fixer.io/api/"
)

type fixer struct {
	baseQuote
}

func (fixer *fixer) Initialize(key string) error {
	return fixer.initialize(key, fixerEndPoint+"symbols", fixer.RefreshQuotes)
}

func (fixer *fixer) RefreshQuotes() error {
	return fixer.refresh(fixerEndPoint+"latest", func(latest *quoteResponse, currencies *[]*model.Currency) *[]model.Currency {

		var currenciesUpdate []model.Currency

		// Obtain USD quote to rebase the quote (workaround for free plan, once fixer return to EUR)
		usd, exist := latest.Rates["USD"]
		if !exist {
			log.Println(errors.New("USD quote not found"))
			return &currenciesUpdate
		}

		// Save values to database and cache
		for k, v := range latest.Rates {
			val := v / usd
			for _, c := range *currencies {
				if k == c.Code {
					c.Rate = &val
					currenciesUpdate = append(currenciesUpdate, *c)
					break
				}
			}
		}
		return &currenciesUpdate
	})
}
