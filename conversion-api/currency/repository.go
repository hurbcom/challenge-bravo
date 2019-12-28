package currency

import "context"

import "conversion-api/models"

//Repository is a interface to represents all connection with data persistence, if you need to store some data, implement this interface
type Repository interface {
	GetCurrency(ctx context.Context, currency string) (models.Currency, error)
	UpdateBallast(ctx context.Context, currency models.Currency) error
	InsertCurrency(ctx context.Context, currency models.Currency) (models.Currency, error)
}
