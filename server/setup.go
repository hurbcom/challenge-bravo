package server

import (
	"fmt"
	"net/http"

	config "github.com/felipepnascimento/challenge-bravo-flp/config"
	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/gin-gonic/gin"
)

func rootHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, entities.Response{
			Success: true,
			Message: "Hello World!",
			Data:    struct{}{},
		})
	}
}

func registerRoutes(router *gin.Engine, handlers *Handlers) {
	router.GET("/", rootHandler())
	router.GET("/api/currency", handlers.CurrencyHandler.GetAllCurrencies)
	router.GET("/api/currency/:id", handlers.CurrencyHandler.GetCurrencyByID)
	router.POST("/api/currency", handlers.CurrencyHandler.CreateCurrency)
	router.DELETE("/api/currency/:id", handlers.CurrencyHandler.DeleteCurrency)
}

func SetupServer() {
	fmt.Println("Setting up server")

	configs := config.GetConfig()
	db := config.ConnectDB(configs)

	repos := SetupRepositories(db)
	useCases := SetupUsecases(repos)
	handlers := SetupHandlers(useCases)

	router := gin.Default()

	registerRoutes(router, handlers)

	router.Run(":8080")
}
