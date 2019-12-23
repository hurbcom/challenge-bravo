package service

import (
	"challenge-bravo/conversion-api/currency"
	"challenge-bravo/conversion-api/models"
	"context"
)

type service struct {
	Repository currency.Repository
	Gateway    currency.Gateway
}

//NewService returns a new instance of service
func NewService(r currency.Repository, g currency.Gateway) currency.Service {
	return &service{
		Repository: r,
		Gateway:    g,
	}
}

func (s *service) ExchangeCurrency(ctx context.Context, currencyFrom, currencyTo string, amount float64) (models.CurrencyExchange, error) {
	return models.CurrencyExchange{}, nil
}

func (s *service) UpdateCurrency(ctx context.Context, currency string) (models.Currency, error) {
	return models.Currency{}, nil
}

func (s *service) CreateCurrency(ctx context.Context, currency string) (models.Currency, error) {
	return models.Currency{}, nil
}
