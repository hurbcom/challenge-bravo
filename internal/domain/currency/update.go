package currency

import (
	"context"
)

func (d *Domain) UpdateCode(ctx context.Context, code string) (interface{}, error) {
	result, err := d.repository.Update(ctx, code, d.Models)
	if err != nil {
		return nil, err
	}
	return result, nil
}
