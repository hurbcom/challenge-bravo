package config

import (
	"fmt"
	"log"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

// ConnectDB to get all needed db connections for application
func ConnectDB(config *entities.Config) *gorm.DB {
	DB = getDBConnection(config)

	return DB
}

func getDBConnection(config *entities.Config) *gorm.DB {
	var databaseUrl string

	databaseUrl = fmt.Sprintf(
		"host=%s port=%d dbname=%s user=%s password=%s sslmode=disable",
		config.Database.Host,
		config.Database.Port,
		config.Database.DbName,
		config.Database.Username,
		config.Database.Password,
	)

	DB, err = gorm.Open(postgres.Open(databaseUrl))
	if err != nil {
		log.Panic("Erro ao conectar com banco de dados")
	}
	DB.AutoMigrate(&models.Currency{})
	DB.AutoMigrate(&models.Conversion{})

	return DB
}
