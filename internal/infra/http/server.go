package http

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	domainErrors "github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/cache"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/storage"
	"github.com/gin-gonic/gin"
)

type ServerConfig struct {
	Port        int
	Environment string
}

type Server struct {
	httpServer    *gin.Engine
	storageClient *storage.StorageClient
	cacheClient   *cache.CacheClient
}

func Run(config *ServerConfig, storageClient *storage.StorageClient, cacheClient *cache.CacheClient) *Server {
	if config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	server := Server{
		httpServer:    gin.New(),
		storageClient: storageClient,
		cacheClient:   cacheClient,
	}

	server.httpServer.Use(gin.Logger())
	server.httpServer.Use(errorMiddleware)
	server.httpServer.NoRoute(notFound)
	server.httpServer.GET("/", healthCheck)
	server.addCurrencyRoutes()

	err := server.httpServer.Run(fmt.Sprintf(":%d", config.Port))
	if err != nil {
		log.Fatalf(err.Error())
	}

	fmt.Printf("Successfully started application on port %d\n", config.Port)

	return &server
}

func notFound(ctx *gin.Context) {
	ctx.JSON(404, gin.H{
		"message": "Resource not found",
	})
}

func errorMiddleware(ctx *gin.Context) {
	ctx.Next()

	var badRequestError *domainErrors.BadRequestError
	var clientFailed *domainErrors.ClientFailed
	var currencyNotFound *domainErrors.CurrencyNotFound
	var unprocessableError *domainErrors.UnprocessableError
	var currencyExistsError *domainErrors.CurrencyAlreadyExists
	var storageError *domainErrors.StorageError

	for _, err := range ctx.Errors {
		response := gin.H{
			"message": err.Error(),
		}

		if errors.As(err.Err, &badRequestError) {
			ctx.JSON(http.StatusBadRequest, response)
			return
		}
		if errors.As(err.Err, &clientFailed) {
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}
		if errors.As(err.Err, &currencyNotFound) {
			ctx.JSON(http.StatusNotFound, response)
			return
		}
		if errors.As(err.Err, &unprocessableError) {
			ctx.JSON(http.StatusUnprocessableEntity, response)
			return
		}
		if errors.As(err.Err, &currencyExistsError) {
			ctx.JSON(http.StatusBadRequest, response)
			return
		}
		if errors.As(err.Err, &storageError) {
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal Server Error",
		})
	}
}

func healthCheck(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "All done",
	})
}
