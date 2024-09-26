package currency_repository

import (
	"context"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/entity"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/repository/sqlc/currency_connection"
)

func UpdateMapToDB(p entity.Currency) currency_connection.UpdateParams {
	res := currency_connection.UpdateParams{
		ID:              p.ID,
		Name:            p.Name,
		Code:            p.Code,
		Number:          p.Number,
		Country:         p.Country,
		CountryCode:     p.CountryCode,
		SearchUrl:       p.SearchURL,
		UsdExchangeRate: p.USDExchangeRate,
		UpdatedBy:       &p.UpdatedBy,
		UpdatedAt:       p.UpdatedAt,
	}

	if p.Fic != nil {
		res.Fic = *p.Fic
	}

	return res
}

func (c CurrencyRepository) Update(ctx context.Context, p entity.Currency) error {
	err := c.queries.Update(ctx, UpdateMapToDB(p))
	if err != nil {
		return err
	}

	return nil
}
