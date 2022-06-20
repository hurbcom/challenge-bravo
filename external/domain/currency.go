package domain

import (
	"github.com/joaohgf/challenge-bravo/external/api"
	"github.com/joaohgf/challenge-bravo/external/repository/models"
)

type Currency struct {
	repository *api.Engine
}

func NewCurrency() *Currency {
	return &Currency{repository: api.NewEngine()}
}

func (c *Currency) GetAllCurrency() ([]*models.CurrencyPrice, error) {
	return c.repository.GetAllCurrency()
}
