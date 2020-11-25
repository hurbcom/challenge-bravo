package controller

import (
	"github.com/ednailson/challenge-bravo/currency"
)

type Controller struct {
	currencyModule currency.Currency
}

func NewController(currencyModule currency.Currency) *Controller {
	return &Controller{currencyModule: currencyModule}
}

func (c *Controller) Convert(from, to string, amount float64) (float64, error) {
	currencyFrom, err := c.currencyModule.Currency(from)
	if err != nil {
		return 0, err
	}
	currencyTo, err := c.currencyModule.Currency(to)
	if err != nil {
		return 0, err
	}
	return ((1 / currencyFrom) * currencyTo) * amount, nil
}

func (c *Controller) AddCurrency(initials string) error {
	return c.currencyModule.AddCurrency(initials)
}

func (c *Controller) DeleteCurrency(initials string) {
	c.currencyModule.DeleteCurrency(initials)
}
