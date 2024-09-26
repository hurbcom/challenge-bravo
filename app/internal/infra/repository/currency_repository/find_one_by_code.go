package currency_repository

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/currency_connection"
)

func FindOneByCodeMapToEntity(p currency_connection.Currency) *entity.Currency {
	return &entity.Currency{
		CreatedAt:       p.CreatedAt,
		UpdatedAt:       p.UpdatedAt,
		CountryCode:     p.CountryCode,
		Number:          p.Number,
		SearchURL:       p.SearchUrl,
		Fic:             &p.Fic,
		Country:         p.Country,
		Name:            p.Name,
		Code:            p.Code,
		ID:              p.ID,
		CreatedBy:       p.CreatedBy,
		UpdatedBy:       *p.UpdatedBy,
		USDExchangeRate: p.UsdExchangeRate,
	}
}

func (c CurrencyRepository) FindOneByCode(ctx context.Context, code string) (*entity.Currency, error) {
	currency, err := c.queries.FindOneByCode(ctx, code)
	if err != nil {
		return nil, err
	}

	return FindOneByCodeMapToEntity(currency), nil
}
