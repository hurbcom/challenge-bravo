package repository

import (
	"database/sql"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
)

var conn *sql.DB

type Postgres struct{}

func NewPostgres(config *util.Config) (repository.Repository, error) {
	db, err := sql.Open(config.DBDriver, config.DBURL)

	if err == nil {
		err = db.Ping()
	}

	conn = db

	NewCurrency()

	return &Postgres{}, err
}

func (postgres *Postgres) Check() error {
	return conn.Ping()
}

func (postgres *Postgres) Close() error {
	return conn.Close()
}

func (postgres *Postgres) Currency() repository.Currency {
	return NewCurrency()
}
