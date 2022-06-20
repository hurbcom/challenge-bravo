package currency

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
)

// GetByCode returns the currency by code from the repository.
func (d *Domain) GetByCode(ctx context.Context, code string) (interface{}, error) {
	result, err := d.repository.Mongo.Get(ctx, bson.M{"code": code})
	if err != nil {
		return nil, err
	}
	return result, nil
}

// GetByFilter returns the currency by filter from the repository.
func (d *Domain) GetByFilter(ctx context.Context, filter interface{}) (interface{}, error) {
	result, err := d.repository.Mongo.Get(ctx, filter)
	if err != nil {
		return nil, err
	}
	return result, nil
}
