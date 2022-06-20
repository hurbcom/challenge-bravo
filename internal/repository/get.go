package repository

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"go.mongodb.org/mongo-driver/bson"
)

// GetPrice returns the latest price of the currency on repositories
func (e *Engine) GetPrice(ctx context.Context, code string) (*float64, error) {
	latestPrice, err := e.Redis.GetPrice(code)
	if err != nil {
		return nil, err
	}
	if latestPrice != nil {
		return latestPrice, nil
	}
	var doc = new(models.Currency)
	oldestResult, err := e.Mongo.GetOne(ctx, bson.M{"code": code})
	if err != nil {
		return nil, err
	}
	if oldestResult == nil {
		return nil, fmt.Errorf("currency not found %s", code)
	}
	oldestBytes, err := bson.Marshal(oldestResult)
	if err != nil {
		return nil, err
	}
	err = bson.Unmarshal(oldestBytes, &doc)
	if err != nil {
		return nil, err
	}
	return doc.Price, nil
}
