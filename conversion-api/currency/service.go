package currency

import (
	"conversion-api/models"
	"context"
)

//Service is a interface to abstract all the business logic from database
type Service interface {
	ExchangeCurrency(ctx context.Context, currencyFrom, currencyTo string, amount float64) (models.CurrencyExchange, error)
	UpdateCurrency(ctx context.Context, currency string) (models.Currency, error)
	CreateCurrency(ctx context.Context, currency string) (models.Currency, error)
}
