package controller

import "github.com/ednailson/challenge-bravo/currency"

type Controller struct {
	currencyModule currency.Currency
}

func NewController(currencyModule currency.Currency) *Controller {
	return &Controller{currencyModule: currencyModule}
}

func (c *Controller) Convert(from, to string, amount float64) (float64, error) {
	currencyFrom, err := c.currencyModule.Extra(from)
	if err != nil {
		return 0, err
	}
	currencyTo, err := c.currencyModule.Extra(to)
	if err != nil {
		return 0, err
	}
	return ((1 / currencyFrom) * currencyTo) * amount, nil
}
