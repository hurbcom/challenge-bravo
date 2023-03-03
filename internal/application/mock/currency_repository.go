package mock

import (
	"fmt"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
)

type CurrencyRepositoryMock struct {
	currencies map[string]*entity.Currency
}

func NewCurrencyRepositoryMock() *CurrencyRepositoryMock {
	return &CurrencyRepositoryMock{
		currencies: make(map[string]*entity.Currency),
	}
}

func (c *CurrencyRepositoryMock) CreateCurrency(currency *entity.Currency) (*entity.Currency, error) {
	c.currencies[currency.Name] = currency
	return currency, nil
}

func (c *CurrencyRepositoryMock) GetCurrencyByName(name string) (*entity.Currency, error) {
	currency, ok := c.currencies[name]
	if !ok {
		return nil, nil
	}

	return currency, nil
}

func (c *CurrencyRepositoryMock) DeleteCurrency(name string) error {
	if _, ok := c.currencies[name]; !ok {
		return fmt.Errorf("currency with name %s not found", name)
	}

	delete(c.currencies, name)
	return nil
}
