package service

import (
	"challenge-bravo/conversion-api/currency"
	"challenge-bravo/conversion-api/models"
	"context"
	"fmt"
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
	var exchange models.CurrencyExchange
	var err error

	if currencyFrom == "" {
		return exchange, fmt.Errorf("error invalid currency from")
	}

	exchange.CurrencyFrom, err = s.Repository.GetCurrency(ctx, currencyFrom)

	if err != nil {
		return exchange, err
	}

	if currencyTo == "" {
		return exchange, fmt.Errorf("error invalid currency to")
	}

	exchange.CurrencyTo, err = s.Repository.GetCurrency(ctx, currencyTo)

	if err != nil {
		return exchange, err
	}

	exchange.OriginalValue = amount

	exchange.ExchangedValue, err = s.calculateExchange(exchange.OriginalValue, exchange.CurrencyFrom.BallastToDollar, exchange.CurrencyTo.BallastToDollar)

	if err != nil {
		return exchange, err
	}

	return exchange, nil
}

func (s *service) UpdateCurrency(ctx context.Context, currencyName string) (models.Currency, error) {
	var currency models.Currency
	var err error

	if currencyName == "" {
		return currency, fmt.Errorf("error invalid currency")
	}

	currency, err = s.Repository.GetCurrency(ctx, currencyName)

	if err != nil {
		return currency, err
	}

	currency, err = s.Gateway.GetCurrencyByName(currency.Name)

	if err != nil {
		return currency, err
	}

	err = s.Repository.UpdateBallast(ctx, currency)

	if err != nil {
		return currency, err
	}

	return currency, nil
}

func (s *service) CreateCurrency(ctx context.Context, currency string) (models.Currency, error) {
	return models.Currency{}, nil
}

func (s *service) calculateExchange(amount, ballastFrom, ballastTo float64) (float64, error) {
	if ballastFrom <= 0 {
		return 0, fmt.Errorf("invalid ballast from because its equal 0")
	}

	if ballastTo == 0 || amount == 0 {
		return 0, nil
	}

	exchange := ballastTo / ballastFrom
	value := amount * exchange

	return value, nil
}
