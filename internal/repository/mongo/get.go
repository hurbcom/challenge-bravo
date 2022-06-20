package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
)

// Get returns the documents that match the filter
func (e *Engine) Get(ctx context.Context, filter interface{}) (interface{}, error) {
	var cur, err = e.collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("error getting data from mongo: %w", err)
	}
	err = cur.Err()
	if err != nil {
		return nil, fmt.Errorf("error on cursor from mongo: %w", err)
	}
	defer func(ctx context.Context) {
		var err = cur.Close(ctx)
		if err != nil {
			panic(err)
		}
	}(ctx)
	var result []interface{}
	for cur.Next(ctx) {
		var doc map[string]interface{}
		err = cur.Decode(&doc)
		if err != nil {
			return nil, fmt.Errorf("error decoding data from mongo: %w", err)
		}
		result = append(result, doc)
	}
	return result, nil
}

// GetOne returns the document that matches the filter
func (e *Engine) GetOne(ctx context.Context, filter interface{}) (map[string]interface{}, error) {
	var result = e.collection.FindOne(ctx, filter)
	var err = result.Err()
	if err == mongo.ErrNilDocument || err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting data from mongo: %w", err)
	}
	var doc map[string]interface{}
	err = result.Decode(&doc)
	if err != nil {
		return nil, fmt.Errorf("error decoding data from mongo: %w", err)
	}
	return doc, nil
}
