package repository

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
)

// DeletePrice removes the currency from all repositories
func (e *Engine) DeletePrice(ctx context.Context, code string) error {
	var err = e.Mongo.Delete(ctx, bson.M{"code": code})
	if err != nil {
		return err
	}

	err = e.Redis.Delete(code)
	if err != nil {
		return err
	}
	return nil

}
