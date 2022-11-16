package main

import (
	"api/src/config"
	"api/src/controllers"
	"api/src/cronjobs"
	"api/src/database"
	"api/src/repositories"
	"api/src/router"
	"api/src/router/routes"
	"api/src/services"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.Load()
	//controllers.InitRedisDatabase()

	database := database.Connect()
	defer database.Close()

	currencyRepository := repositories.NewCurrencyRepository(database)
	currencyService := services.NewCurrencyService(currencyRepository)
	currencyController := controllers.NewCurrencyController(currencyService)

	cronjob := cronjobs.NewCurrencyCronJob(currencyController)
	go cronjob.Run()

	routes.GenerateRoutes(currencyController)
	router := router.Generate()

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.ApiPort), router))
}
