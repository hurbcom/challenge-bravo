package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Delete removes a document from the MongoDB
func (e *Engine) Delete(ctx context.Context, filter bson.M) error {
	var result = e.collection.FindOneAndDelete(ctx, filter)
	var err = result.Err()
	if err == mongo.ErrNoDocuments {
		return nil
	}
	if err != nil {
		return fmt.Errorf("error deleting data from mongo: %w", err)
	}
	return nil
}
