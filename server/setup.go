package server

import (
	"fmt"
	"net/http"

	config "github.com/felipepnascimento/challenge-bravo-flp/config"
	"github.com/gin-gonic/gin"
)

func rootController() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, "Hello World!")
	}
}

func registerRoutes(router *gin.Engine, controllers *Controllers) {
	router.GET("/", rootController())
	router.GET("/currency", controllers.CurrencyController.GetAllCurrencies)
	router.GET("/currency/:id", controllers.CurrencyController.GetCurrencyById)
	router.POST("/currency", controllers.CurrencyController.CreateCurrency)
	router.DELETE("/currency/:id", controllers.CurrencyController.DeleteCurrency)

	router.GET("/conversion", controllers.ConversionController.Convert)
}

func StartSeed(seeds *Seeds) {
	fmt.Println("Starting seeds Migration")

	seeds.CurrencySeed.SeedInitialCurrency()
}

func SetupServer() {
	fmt.Println("Setting up server")

	configs := config.GetConfig()
	db := config.ConnectDB(configs)
	httpClient := &http.Client{}

	repos := SetupRepositories(db)
	services := SetupServices(httpClient)
	useCases := SetupUsecases(repos, services)
	controllers := SetupControllers(useCases)
	seeds := SetupSeeds(useCases)

	router := gin.Default()

	registerRoutes(router, controllers)
	StartSeed(seeds)

	router.Run(":8080")
}
