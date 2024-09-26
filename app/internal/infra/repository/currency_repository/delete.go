package currency_repository

import (
	"context"
)

func (c CurrencyRepository) Delete(ctx context.Context, id int) error {
	err := c.queries.Delete(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
