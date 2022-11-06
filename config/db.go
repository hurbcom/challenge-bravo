package config

import (
	"fmt"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

// ConnectDB to get all needed db connections for application
func ConnectDB(config *entities.Config) *sqlx.DB {
	DB = getDBConnection(config)

	return DB
}

func getDBConnection(config *entities.Config) *sqlx.DB {
	var dbConnectionStr string

	dbConnectionStr = fmt.Sprintf(
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=disable",
		config.Database.Host,
		config.Database.Port,
		config.Database.DbName,
		config.Database.Username,
		config.Database.Password,
	)

	db, err := sqlx.Open("postgres", dbConnectionStr)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	db.SetMaxIdleConns(1)
	db.SetMaxOpenConns(5)

	fmt.Println("Connected to DB")
	return db
}
