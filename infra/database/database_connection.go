package database

import (
	"fmt"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	DATABASE_HOST_ENV_VAR     = "DATABASE_HOST"
	DATABASE_USER_ENV_VAR     = "DATABASE_USER"
	DATABASE_PASSWORD_ENV_VAR = "DATABASE_PASSWORD"
	DATABASE_NAME_ENV_VAR     = "DATABASE_NAME"
	DATABASE_PORT_ENV_VAR     = "DATABASE_PORT"
	DATABASE_TIMEZONE_ENV_VAR = "DATABASE_TIMEZONE"
)

type (
	DatabaseConnection interface{}
)

func NewDatabaseConnection(environment env.Environment) (DatabaseConnection, error) {

	dsn, err := getDsn(environment)
	if err != nil {
		return nil, err
	}
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return conn, nil

}

func getDsn(environment env.Environment) (string, error) {
	host, err := environment.Get(DATABASE_HOST_ENV_VAR)
	if err != nil {
		return "", err
	}

	user, err := environment.Get(DATABASE_USER_ENV_VAR)
	if err != nil {
		return "", err
	}

	password, err := environment.Get(DATABASE_PASSWORD_ENV_VAR)
	if err != nil {
		return "", err
	}

	name, err := environment.Get(DATABASE_NAME_ENV_VAR)
	if err != nil {
		return "", err
	}

	port, err := environment.Get(DATABASE_PORT_ENV_VAR)
	if err != nil {
		return "", err
	}

	timezone, err := environment.Get(DATABASE_TIMEZONE_ENV_VAR)
	if err != nil {
		return "", err
	}

	dsnFormat := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=%s"
	dsn := fmt.Sprintf(dsnFormat, host, user, password, name, port, timezone)
	return dsn, nil
}
