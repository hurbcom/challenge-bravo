package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

// Update updates a document on the database using the fields in the data map
func (e *Engine) Update(ctx context.Context, filter bson.M, data map[string]interface{}) (interface{}, error) {
	var result = e.collection.FindOneAndUpdate(ctx, filter, parseFields(data),
		options.FindOneAndUpdate().SetUpsert(true),
		options.FindOneAndUpdate().SetReturnDocument(options.After))
	var err = result.Err()
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error updating data from mongo: %w", err)
	}
	var doc map[string]interface{}
	err = result.Decode(&doc)
	if err != nil {
		return nil, fmt.Errorf("error decoding data from mongo: %w", err)
	}
	return doc, nil
}

// parseFields converts a map[string]interface{} to a bson.M to set on the database
func parseFields(data map[string]interface{}) bson.M {
	now := time.Now()
	var result = bson.M{
		"updatedAt": now,
	}
	for key, value := range data {
		result[key] = value
	}
	return bson.M{"$set": result}
}
