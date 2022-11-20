package main

import (
	"challenge-bravo/src/adapters"
	"challenge-bravo/src/config"
	"challenge-bravo/src/controllers"
	"challenge-bravo/src/cronjobs"
	"challenge-bravo/src/database"
	"challenge-bravo/src/repositories"
	"challenge-bravo/src/router"
	"challenge-bravo/src/router/routes"
	"challenge-bravo/src/services"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.Load()

	db := database.Connect()
	defer db.Close()

	searchCurrencyRepository := repositories.NewCurrencyRepository(db)
	externalApiAdapter := adapters.ExternalAPIAdapter{}
	searchCurrencyService := services.NewCurrencyService(searchCurrencyRepository, &externalApiAdapter)
	searchCurrencyController := controllers.NewCurrencyController(searchCurrencyService)

	conversionService := services.NewConversionService(*searchCurrencyService)
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
