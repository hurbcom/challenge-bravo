package storage

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type StorageClient struct {
	client   *mongo.Client
	database *mongo.Database
}

func Connect(hostname string, database string) *StorageClient {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(hostname))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB")
	}

	return &StorageClient{
		client:   mongoClient,
		database: mongoClient.Database(database),
	}
}

func (storageClient *StorageClient) Disconnect() {
	err := storageClient.client.Disconnect(context.TODO())
	if err != nil {
		panic(err)
	}
}
