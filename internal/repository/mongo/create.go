package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Create creates a document on the database
func (e *Engine) Create(ctx context.Context, data interface{}) (interface{}, error) {
	switch data.(type) {
	case []interface{}:
		var data, ok = data.([]interface{})
		if !ok {
			return nil, fmt.Errorf("error parsing data %v", ok)
		}
		result, err := e.collection.InsertMany(ctx, data)
		if err != nil {
			return nil, fmt.Errorf("error create many data on mongo: %w", err)
		}
		return result, nil
	default:
		result, err := e.collection.InsertOne(ctx, data)
		if err != nil {
			return nil, fmt.Errorf("error create data on mongo: %w", err)
		}
		return result, nil
	}
}

// CreateIfNotExist creates a document on the database if it doesn't exist
func (e *Engine) CreateIfNotExist(ctx context.Context, filter bson.M, data interface{}) (interface{}, error) {
	var result = e.collection.FindOneAndUpdate(
		ctx,
		filter,
		bson.M{"$setOnInsert": data},
		options.FindOneAndUpdate().SetUpsert(true),
		options.FindOneAndUpdate().SetReturnDocument(options.After))
	var err = result.Err()
	if err == mongo.ErrNoDocuments && err == mongo.ErrNilDocument {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error create or updating data from mongo: %w", err)
	}
	var doc map[string]interface{}
	err = result.Decode(&doc)
	if err != nil {
		return nil, fmt.Errorf("error decoding data from mongo: %w", err)
	}
	return doc, nil
}
