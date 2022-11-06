package server

import (
	"fmt"
	"net/http"

	config "github.com/felipepnascimento/challenge-bravo-flp/config"
	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	utils "github.com/felipepnascimento/challenge-bravo-flp/utils"
	"github.com/gin-gonic/gin"
)

func rootHandler() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, entities.Response{
			Success: true,
			Message: "Hello World!",
			Data:    struct{}{},
		})
	}
}

func registerRoutes(router *gin.Engine, handlers *Handlers) {
	serveHttp := utils.ServeHTTP

	router.GET("/", rootHandler())
	router.GET("/api/currency", serveHttp(handlers.CurrencyHandler.GetAllCurrencies))
	router.GET("/api/currency/:id", serveHttp(handlers.CurrencyHandler.GetCurrencyByID))
	router.POST("/api/currency", serveHttp(handlers.CurrencyHandler.CreateCurrency))
	router.DELETE("/api/currency/:id", serveHttp(handlers.CurrencyHandler.DeleteCurrency))
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
