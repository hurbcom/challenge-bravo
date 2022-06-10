package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"os"
	"time"
)

// connect returns a new mongo client and check if the DB is responding
func connect(ctx context.Context) (*mongo.Client, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(
		os.Getenv("MONGO_URI")).SetConnectTimeout(10 * time.Second))
	if err != nil {
		panic(err)
	}

	if err := client.Connect(ctx); err != nil {
		panic(err)
	}
	if err = ping(ctx, client); err != nil {
		panic(err)
	}
	return client, nil
}

// ping check if the DB it's responding
func ping(ctx context.Context, cli *mongo.Client) error {
	ctxWthCancel, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := cli.Ping(ctxWthCancel, readpref.Primary()); err != nil {
		return err
	}
	return nil
}
