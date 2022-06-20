package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"time"
)

// connect returns a new mongo client and check if the DB is responding
func connect(ctx context.Context, uri string) (*mongo.Client, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(uri).SetConnectTimeout(10 * time.Second))
	if err != nil {
		return nil, err
	}

	if err := client.Connect(ctx); err != nil {
		return nil, err
	}
	if err = ping(ctx, client); err != nil {
		return nil, err
	}
	return client, nil
}

// ping check if the DB it's responding
func ping(ctx context.Context, cli *mongo.Client) error {
	ctxWthCancel, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := cli.Ping(ctxWthCancel, readpref.Primary()); err != nil {
		return err
	}
	return nil
}
