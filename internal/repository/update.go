package repository

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"go.mongodb.org/mongo-driver/bson"
)

// Update the currency on all repositories
func (e *Engine) Update(ctx context.Context, code string, data *models.Currency) (interface{}, error) {
	var dataMap, err = data.ParseToMap()
	if err != nil {
		return nil, err
	}
	result, err := e.Mongo.Update(ctx, bson.M{"code": code}, dataMap)
	if err != nil {
		return nil, err
	}
	if result != nil {
		var model = new(models.Currency)
		bytesResult, err := bson.Marshal(result)
		if err != nil {
			return nil, err
		}
		err = bson.Unmarshal(bytesResult, model)
		if err != nil {
			return nil, err
		}
		err = e.Redis.SetPrice(model.Code, model.GetPriceString())
		if err != nil {
			return nil, err
		}
		return model, nil
	}
	return nil, fmt.Errorf("currency not found")
}
