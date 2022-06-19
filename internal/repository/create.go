package repository

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
)

// Create the currency on all repositories
func (e *Engine) Create(ctx context.Context, model ModelBuilder) (interface{}, error) {
	// create the currency on mongo if it doesn't exist with the same code
	result, err := e.Mongo.CreateIfNotExist(
		ctx,
		bson.M{"code": strings.ToUpper(model.GetCode())},
		model)
	if err != nil {
		return nil, err
	}
	// if not created, don't update the redis
	if result == nil {
		return nil, nil
	}

	// set the price on redis to be used to convert
	err = e.Redis.SetPrice(model.GetCode(), model.GetPriceString())
	if err != nil {
		return nil, err
	}

	// set the types wich are base currencies on redis
	err = e.Redis.SetType(model.GetCode(), model.GetName())
	if err != nil {
		return nil, err
	}
	return result, nil
}
