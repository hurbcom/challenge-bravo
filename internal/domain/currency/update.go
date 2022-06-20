package currency

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
)

func (d *Domain) UpdateCode(ctx context.Context, code string, data models.Currency) (interface{}, error) {
	result, err := d.repository.Update(ctx, code, &data)
	if err != nil {
		return nil, err
	}
	return result, nil
}
