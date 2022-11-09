package config

import (
	"fmt"
	"log"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var (
	DB  *sqlx.DB
	err error
)

func ConnectDB(config *entities.Config) *sqlx.DB {
	DB = getDBConnection(config)

	return DB
}

func getDBConnection(config *entities.Config) *sqlx.DB {
	var databaseUrl string

	databaseUrl = fmt.Sprintf(
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=disable",
		config.Database.Host,
		config.Database.Port,
		config.Database.DbName,
		config.Database.Username,
		config.Database.Password,
	)

	DB, err := sqlx.Open("postgres", databaseUrl)

	if err != nil {
		log.Panic("Erro ao conectar com banco de dados")
	}

	DB.SetMaxIdleConns(1)
	DB.SetMaxOpenConns(5)

	return DB
}
