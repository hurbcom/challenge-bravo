package main

import (
	"fmt"
	"log"
	"os"

	"github.com/danielmalka/challenge-bravo/application/currency"
	"github.com/danielmalka/challenge-bravo/config"
	"github.com/danielmalka/challenge-bravo/internal/flags"
	"github.com/danielmalka/challenge-bravo/internal/http/gin"
	"github.com/danielmalka/challenge-bravo/internal/server"
	"github.com/danielmalka/challenge-bravo/pkg/storage"
	"gorm.io/gorm"
)

// @title Conversor de Moedas
// @version 1.0
// @description API para conversão de moedas
// @termsOfService http://swagger.io/terms/
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8085
// @BasePath /
func main() {
	c, err := config.ReadConfig()
	if err != nil {
		log.Println(err)
		return
	}
	log.SetOutput(os.Stdout)
	flags.CheckFlags(c)

	log.Println("# API Initialized")

	initAPI(c)
}

func initAPI(c config.Config) {
	err, response, currencyService := initService(c)
	if err != nil {
		log.Fatalf("error initializing database and service: %s", err)
	}
	h := gin.Handlers(c.AppStage, currencyService, response)
	err = server.Start(c.Port, h)
	if err != nil {
		log.Fatalf("error running server: %s", err)
	}
}

func initService(config config.Config) (error, gin.Message, *currency.Service) {
	db, err, response := getDB(config)
	if err != nil {
		log.Println("error connecting to database: ", err)
		return err, response, nil
	}
	service := currency.NewService(db)
	return err, response, service
}

func getDB(c config.Config) (*gorm.DB, error, gin.Message) {
	errorMessage := gin.NewErrorMessage()
	userPass := fmt.Sprintf("%s:%s", c.DBUser, c.DBPass)
	host := fmt.Sprintf("%s:%s", c.DBHost, c.DBPort)
	db, err := storage.ConnectMysql(userPass, c.DBSchema, host)
	return db, err, errorMessage
}
