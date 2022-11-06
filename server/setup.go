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

func registerRoutes(router *gin.Engine, hndlrs *Handlers) {
	serveHttp := utils.ServeHTTP

	router.GET("/", rootHandler())
	router.GET("/tweet", serveHttp(hndlrs.TweetHandler.GetAllTweets))
	router.GET("/tweet/:id", serveHttp(hndlrs.TweetHandler.GetTweetByID))
	router.GET("/tweet/search", serveHttp(hndlrs.TweetHandler.SearchTweetByText))
	router.POST("/tweet", serveHttp(hndlrs.TweetHandler.CreateTweet))
	router.PUT("/tweet", serveHttp(hndlrs.TweetHandler.UpdateTweet))
	router.DELETE("/tweet/:id", serveHttp(hndlrs.TweetHandler.DeleteTweet))
}

func SetupServer() {
	fmt.Println("Setting up server")

	configs := config.GetConfig()
	db := config.ConnectDB(configs)

	repos := SetupRepositories(db)
	uscs := SetupUsecases(repos)
	hdnlrs := SetupHandlers(uscs)

	router := gin.Default()

	registerRoutes(router, hdnlrs)

	router.Run(":9090")
}
