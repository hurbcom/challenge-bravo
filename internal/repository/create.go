package repository

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"go.mongodb.org/mongo-driver/bson"
	"strings"
)

// Create the currency on all repositories
func (e *Engine) Create(ctx context.Context, model *models.Currency) (interface{}, error) {
	// create the currency on mongo if it doesn't exist with the same code
	result, err := e.Mongo.CreateIfNotExist(
		ctx,
		bson.M{"code": strings.ToUpper(model.Code)},
		model)
	if err != nil {
		return nil, err
	}
	// if not created, don't set the redis
	if result == nil {
		return nil, nil
	}

	// set the price on redis to be used to convert
	err = e.Redis.SetPrice(model.Code, model.GetPriceString())
	if err != nil {
		return nil, err
	}

	return result, nil
}
