package mock

import (
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
)

type CurrencyCacheRepositoryMock struct {
	currencies map[string]*entity.Currency
}

func NewCurrencyCacheRepositoryMock() *CurrencyCacheRepositoryMock {
	return &CurrencyCacheRepositoryMock{
		currencies: make(map[string]*entity.Currency),
	}
}

func (c *CurrencyCacheRepositoryMock) GetCurrency(name string) *entity.Currency {
	if currency, ok := c.currencies[name]; ok {
		return currency
	}

	return nil
}

func (c *CurrencyCacheRepositoryMock) CreateCurrency(currency *entity.Currency) bool {
	if _, ok := c.currencies[currency.Name]; ok {
		return false
	}

	c.currencies[currency.Name] = currency
	return true
}

func (c *CurrencyCacheRepositoryMock) DeleteCurrency(name string) bool {
	if _, ok := c.currencies[name]; ok {
		delete(c.currencies, name)
		return true
	}

	return false
}
