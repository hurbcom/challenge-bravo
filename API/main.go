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

	db := database.Connect()
	defer db.Close()

	searchCurrencyRepository := repositories.NewCurrencyRepository(db)
	searchCurrencyService := services.NewCurrencyService(searchCurrencyRepository)
	searchCurrencyController := controllers.NewCurrencyController(searchCurrencyService)

	conversionService := services.NewConversionService(searchCurrencyRepository, *searchCurrencyService)
	conversionController := controllers.NewConversionController(conversionService)

	syncRepository := repositories.NewSyncRepository(db)
	syncService := services.NewSyncService(syncRepository, searchCurrencyService)
	syncController := controllers.NewSyncCurrencyController(syncService)

	seed := database.NewDatabaseSeed(searchCurrencyController, syncService)
	seed.SeedDatabase()

	cronjob := cronjobs.NewCurrencyCronJob(syncController)
	go cronjob.Run()

	routes.GenerateSearchCurrencyRoutes(searchCurrencyController)
	routes.GenerateConversionRoutes(conversionController)
	routes.GenerateSyncRoutes(syncController)
	router := router.Generate()

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.ApiPort), router))
}
