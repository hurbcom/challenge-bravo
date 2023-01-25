package main

import (
	"challenge-bravo/src/config"
	"challenge-bravo/src/controllers"
	"challenge-bravo/src/database"
	"challenge-bravo/src/repository"
	"challenge-bravo/src/router/routes"
	"challenge-bravo/src/services"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/robfig/cron/v3"
)

func main() {
	config.Load()

	db, err := database.Connection()
	if err != nil {
		fmt.Println(err)
		return
	}

	defer database.Close(db)

	collection := database.DbConnect(db, os.Getenv("MONGODB_COLLECTION"))

	currencyRepository := repository.NewCurrencyRepository(collection)

	currencyService := services.NewCurrencyService(currencyRepository)

	currencyController := controllers.NewCurrencyController(currencyService)

	c := cron.New()
	c.AddFunc("@every 30s", func() {
		err = services.CronUpdateCurrenciesFromApi(currencyRepository)
		if err != nil {
			fmt.Println(err)
		}
	})
	c.Start()
	defer c.Stop()

	router := mux.NewRouter()
	routes.CreateCurrencyRoutes(router, currencyController)

	fmt.Printf("Api Listen port %d\n", config.Port)
	http.ListenAndServe(fmt.Sprintf(":%d", config.Port), router)
}
