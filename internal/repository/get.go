package repository

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

func (e *Engine) GetPrice(ctx context.Context, code string) (*models.Currency, error) {
	ctype, err := e.Redis.GetType(code)
	if err != nil {
		return nil, err
	}
	if ctype == "" {
		return nil, fmt.Errorf("currency not found %s", code)
	}
	latestPrice, err := e.Redis.GetPrice(code)
	if err != nil {
		return nil, err
	}
	var doc = new(models.Currency)
	if latestPrice != nil {
		doc.Code = code
		doc.Price = latestPrice
		duration, err := e.Redis.GetTTl(code)
		if err != nil {
			return nil, err
		}
		updateAt := time.Now().Add(-*duration)
		doc.UpdatedAt = &updateAt
		return doc, nil
	}
	oldestResult, err := e.Mongo.GetOne(ctx, bson.M{"code": code})
	if err != nil {
		return nil, err
	}
	if oldestResult == nil {
		return nil, fmt.Errorf("currency not found %s, talk support", code)
	}
	oldestBytes, err := bson.Marshal(oldestResult)
	if err != nil {
		return nil, err
	}
	err = bson.Unmarshal(oldestBytes, &doc)
	if err != nil {
		return nil, err
	}
	return doc, nil
}
