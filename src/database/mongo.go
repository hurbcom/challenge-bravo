package database

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connection() (*mongo.Client, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
	if err != nil {
		return nil, err
	}
	fmt.Println("MongoDb Connected...")
	return client, nil
}

func DbConnect(client *mongo.Client, collection string) *mongo.Collection {
	coll := client.Database(os.Getenv("MONGODB_DB")).Collection(collection)
	return coll
}

func Close(db *mongo.Client) {
	if err := db.Disconnect(context.TODO()); err != nil {
		fmt.Println(err)
	}
	fmt.Println("MongoDb Disconnected...")
}
