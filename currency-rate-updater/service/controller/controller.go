package controller

import (
	"fmt"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/cache"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/currency"
	customErrors "github.com/iiurydias/challenge-bravo/currency-rate-updater/service/errors"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
)

type controller struct {
	cacheModule       cache.Cache
	currencyModule    currency.Currency
	allowedCurrencies []string
}

func New(cacheModule cache.Cache, currencyModule currency.Currency, allowedCurrencies []string) Controller {
	return &controller{
		cacheModule:       cacheModule,
		currencyModule:    currencyModule,
		allowedCurrencies: allowedCurrencies,
	}
}

func (c *controller) AddCurrency(code string) error {
	if _, ok := c.existCurrency(code); ok {
		return customErrors.ErrCurrencyAlreadyExist
	}
	value, err := c.currencyModule.GetCurrencyRate(code)
	if err != nil {
		return err
	}
	c.addCurrency(code)
	if err = c.cacheModule.Set(code, value); err != nil {
		c.removeCurrency(code)
		return errors.Wrap(err, fmt.Sprintf("failed to add to cache currency called %s", code))
	}
	return nil
}

func (c *controller) RemoveCurrency(code string) error {
	if ok := c.removeCurrency(code); !ok {
		return customErrors.ErrCurrencyNotFound
	}
	if err := c.cacheModule.Delete(code); err != nil {
		c.addCurrency(code)
		return errors.Wrap(err, fmt.Sprintf("failed to remove from cache currency called %s", code))
	}
	return nil
}

func (c *controller) UpdateCurrencies() error {
	currencies, err := c.currencyModule.GetAllCurrenciesRate()
	if err != nil {
		return err
	}
	for _, allowedCurrency := range c.allowedCurrencies {
		if value, ok := currencies[allowedCurrency]; ok {
			if err := c.cacheModule.Set(allowedCurrency, value); err != nil {
				log.Errorln(fmt.Sprintf("failed to update in cache currency called %s", allowedCurrency))
			}
			log.Infoln(fmt.Sprintf("currency %s was updated on cache to value %f", allowedCurrency, value))
		}
	}
	return nil
}

func (c *controller) GetAllowedCurrencies() []string {
	return c.allowedCurrencies
}

func (c *controller) existCurrency(code string) (int, bool) {
	for index, value := range c.allowedCurrencies {
		if code == value {
			return index, true
		}
	}
	return 0, false
}

func (c *controller) removeCurrency(code string) bool {
	index, ok := c.existCurrency(code)
	if !ok {
		return ok
	}
	c.allowedCurrencies = append(c.allowedCurrencies[:index], c.allowedCurrencies[index+1:]...)
	return ok
}

func (c *controller) addCurrency(code string) {
	c.allowedCurrencies = append(c.allowedCurrencies, code)
}
