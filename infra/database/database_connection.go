package database

import (
	"context"
	"fmt"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
)

const (
	DatabaseHostEnvVar     = "DATABASE_HOST"
	DatabaseUserEnvVar     = "DATABASE_USER"
	DatabasePasswordEnvVar = "DATABASE_PASSWORD"
	DatabasePortEnvVar     = "DATABASE_PORT"
)

type (
	MongoDatabaseConnection interface {
		Database(name string, opts ...*options.DatabaseOptions) *mongo.Database
		Ping(ctx context.Context, rp *readpref.ReadPref) error
	}
)

func NewDatabaseConnection(environment env.Environment) (MongoDatabaseConnection, error) {

	uri, err := getUri(environment)
	if err != nil {
		return nil, err
	}
	credentials, err := getCredentials(environment)
	if err != nil {
		return nil, err
	}
	clientOptions := options.Client().ApplyURI(uri).SetAuth(credentials)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	return client, nil

}

func getUri(environment env.Environment) (string, error) {
	host, err := environment.Get(DatabaseHostEnvVar)
	if err != nil {
		return "", err
	}

	port, err := environment.Get(DatabasePortEnvVar)
	if err != nil {
		return "", err
	}

	uriFormat := "mongodb://%s:%s/"
	dsn := fmt.Sprintf(uriFormat, host, port)
	return dsn, nil
}

func getCredentials(environment env.Environment) (options.Credential, error) {
	user, err := environment.Get(DatabaseUserEnvVar)
	if err != nil {
		return options.Credential{}, err
	}

	password, err := environment.Get(DatabasePasswordEnvVar)
	if err != nil {
		return options.Credential{}, err
	}

	return options.Credential{
		Username:    user,
		Password:    password,
		PasswordSet: true,
	}, nil
}
