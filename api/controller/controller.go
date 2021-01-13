package controller

import "challenge-bravo-1/api/currency"

type Controller struct {
	curr currency.Currency
}

func NewController(curr currency.Currency) *Controller {
	return &Controller{
		curr: curr,
	}
}

func (c *Controller) NewCurrency(name string) error {
	err := c.curr.NewCurrency(name)
	if err != nil {
		return err
	}
	return nil
}

func (c *Controller) DeleteCurrency(name string) error {
	err := c.curr.DeleteCurrency(name)
	if err != nil {
		return err
	}
	return nil
}

func (c *Controller) Convert(to string, from string, amount float64) (*float64, error) {
	var cuConvert = currency.CurrencyConvert{
		To:     to,
		From:   from,
		Amount: amount,
	}
	value, err := c.curr.Convert(cuConvert)
	if err != nil {
		return nil, err
	}
	return value, nil
}

func (c *Controller) GetAllCurrencies() map[string]float64 {
	currencies := c.curr.GetAllCurrencies()
	return currencies
}
