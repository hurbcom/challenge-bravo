package service

import (
	"challenge-bravo/conversion-api/currency"
	"challenge-bravo/conversion-api/models"
	"context"
	"fmt"
	"time"
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

	expiredFrom := exchange.CurrencyFrom.Timestamp.Sub(time.Now()) > 2

	if exchange.CurrencyFrom.BallastToDollar <= 0 || expiredFrom {
		exchange.CurrencyFrom, err = s.UpdateCurrency(ctx, exchange.CurrencyFrom.Name)
		if err != nil {
			return exchange, err
		}
	}

	if currencyTo == "" {
		return exchange, fmt.Errorf("error invalid currency to")
	}

	exchange.CurrencyTo, err = s.Repository.GetCurrency(ctx, currencyTo)

	if err != nil {
		return exchange, err
	}

	expiredTo := exchange.CurrencyTo.Timestamp.Sub(time.Now()) > 2

	if exchange.CurrencyTo.BallastToDollar <= 0 || expiredTo {
		exchange.CurrencyTo, err = s.UpdateCurrency(ctx, exchange.CurrencyTo.Name)
		if err != nil {
			return exchange, err
		}
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

	newCurrency, err := s.Gateway.GetCurrencyByName(currency.Name)

	if err != nil {
		return currency, err
	}

	newCurrency.ID = currency.ID
	err = s.Repository.UpdateBallast(ctx, newCurrency)

	if err != nil {
		if err.Error() != "Error no lines where affected during update of Ballast" {
			return currency, err
		}
	}

	return s.Repository.GetCurrency(ctx, currency.Name)
}

func (s *service) CreateCurrency(ctx context.Context, currencyName string) (models.Currency, error) {
	var currency models.Currency
	var err error

	if currencyName == "" {
		return currency, fmt.Errorf("error invalid currency")
	}

	currency, err = s.Repository.GetCurrency(ctx, currencyName)

	if err != nil {
		if err.Error() != "sql: no rows in result set" {
			return currency, err
		}
	}

	if currency != (models.Currency{}) {
		return currency, fmt.Errorf("Currency already exists on our database")
	}

	currency, err = s.Gateway.GetCurrencyByName(currencyName)

	if err != nil {
		return currency, err
	}

	currency, err = s.Repository.InsertCurrency(ctx, currency)

	if err != nil {
		return currency, err
	}

	return currency, nil
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
