package currency

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
)

func (d *Domain) GetByCode(ctx context.Context, code string) (interface{}, error) {
	result, err := d.repository.Mongo.Get(ctx, bson.M{"code": code})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (d *Domain) GetByFilter(ctx context.Context, filter interface{}) (interface{}, error) {
	result, err := d.repository.Mongo.Get(ctx, filter)
	if err != nil {
		return nil, err
	}
	return result, nil
}
