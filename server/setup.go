package server

import (
	"fmt"
	"net/http"

	config "github.com/felipepnascimento/challenge-bravo-flp/config"
	"github.com/gin-gonic/gin"
)

func rootHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, "Hello World!")
	}
}

func registerRoutes(router *gin.Engine, handlers *Handlers) {
	router.GET("/", rootHandler())
	router.GET("/currency", handlers.CurrencyHandler.GetAllCurrencies)
	router.GET("/currency/:id", handlers.CurrencyHandler.GetCurrencyBy)
	router.POST("/currency", handlers.CurrencyHandler.CreateCurrency)
	router.DELETE("/currency/:id", handlers.CurrencyHandler.DeleteCurrency)

	router.GET("/conversion", handlers.ConversionHandler.Convert)
}

func SetupServer() {
	fmt.Println("Setting up server")

	configs := config.GetConfig()
	db := config.ConnectDB(configs)
	httpClient := &http.Client{}

	repos := SetupRepositories(db)
	useCases := SetupUsecases(repos)
	services := SetupServices(httpClient)
	handlers := SetupHandlers(useCases, services)

	router := gin.Default()

	registerRoutes(router, handlers)

	router.Run(":8080")
}
