package currency

import (
	"context"
	"time"
)

func (d *Domain) Create(ctx context.Context) (interface{}, error) {
	var now = time.Now()
	d.Models.CreatedAt = &now
	var result, err = d.repository.Create(ctx, d.Models)
	if err != nil {
		return nil, err
	}
	return result, nil
}
