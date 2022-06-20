package domain

import (
	"github.com/joaohgf/challenge-bravo/external/api"
	"github.com/joaohgf/challenge-bravo/external/repository/models"
)

// Currency is the domain to interact with the external api
type Currency struct {
	repository *api.Engine
}

// NewCurrency creates a new currency domain to interact with the external api
func NewCurrency() *Currency {
	return &Currency{repository: api.NewEngine()}
}

// GetAllCurrency gets all currencies from external api
func (c *Currency) GetAllCurrency() ([]*models.CurrencyPrice, error) {
	return c.repository.GetAllCurrency()
}
