package hurb

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type db struct {
	client *mongo.Client
	close  func()
}

func newMongoClient() (db, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://admin:randomhze3185JFK@localhost:27017"))
	if err != nil {
		return db{}, err
	}
	ctx, close := context.WithTimeout(context.Background(), 20*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		close()
		return db{}, err
	}
	return db{client: client, close: close}, nil
}
