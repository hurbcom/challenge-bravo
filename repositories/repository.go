package repositories

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/victorananias/challenge-bravo/helpers"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	client *mongo.Client
	db     *mongo.Database
	ctx    context.Context
}

func NewRepository() *Repository {
	repository := &Repository{}

	client, err := mongo.NewClient(options.Client().ApplyURI(connectionString()))
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if err != nil {
		log.Fatalf(err.Error())
	}
	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf(err.Error())
	}
	repository.client = client
	repository.db = client.Database(helpers.Env.DbName)
	return repository
}

func connectionString() string {
	return fmt.Sprintf("mongodb://%s:%s@%s", helpers.Env.DbUser, helpers.Env.DbPassword, helpers.Env.DbHost)
}
