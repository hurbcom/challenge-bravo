package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"os"
)

// Engine is the mongo representation to be used by repository
// to connect to mongo
type Engine struct {
	client     *mongo.Client
	database   *mongo.Database
	collection *mongo.Collection
}

// NewEngine creates a new engine to connect to mongo
func NewEngine(ctx context.Context) (*Engine, error) {
	var client, err = connect(ctx, os.Getenv("MONGO_URI"))
	if err != nil {
		return nil, err
	}
	// get the database and set the default one
	var engine = &Engine{client: client, database: client.Database(os.Getenv("MONGO_DB"))}
	// set default collection
	engine.SetCollection("currency")
	return engine, nil
}

// SetCollection sets the collection to be used
func (e *Engine) SetCollection(name string) {
	e.collection = e.database.Collection(name)
}

// Close closes the connection to mongo
func (e *Engine) Close(ctx context.Context) error {
	return e.client.Disconnect(ctx)
}
