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
    DATABASE_HOST_ENV_VAR     = "DATABASE_HOST"
    DATABASE_USER_ENV_VAR     = "DATABASE_USER"
    DATABASE_PASSWORD_ENV_VAR = "DATABASE_PASSWORD"
    DATABASE_PORT_ENV_VAR     = "DATABASE_PORT"
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
    host, err := environment.Get(DATABASE_HOST_ENV_VAR)
    if err != nil {
        return "", err
    }

    port, err := environment.Get(DATABASE_PORT_ENV_VAR)
    if err != nil {
        return "", err
    }

    uriFormat := "mongodb://%s:%s/"
    dsn := fmt.Sprintf(uriFormat, host, port)
    return dsn, nil
}

func getCredentials(environment env.Environment) (options.Credential, error) {
    user, err := environment.Get(DATABASE_USER_ENV_VAR)
    if err != nil {
        return options.Credential{}, err
    }

    password, err := environment.Get(DATABASE_PASSWORD_ENV_VAR)
    if err != nil {
        return options.Credential{}, err
    }

    return options.Credential{
        Username:    user,
        Password:    password,
        PasswordSet: true,
    }, nil
}
