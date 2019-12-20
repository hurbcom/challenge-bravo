package currency

import "context"

//Service is a interface to abstract all the business logic from database
type Service interface {
	ExchangeCurrency(ctx context.Context, currency models.Currency) (models.ExchangeCurrency, error)
	UpdateCurrency(ctx context.Context, currency models.Currency) error
	CreateCurrency(ctx context.Context, currency models.Currency) (models.Currency, error)
}
