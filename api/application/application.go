package application

import (
	"context"
	"fmt"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	"github.com/iiurydias/challenge-bravo/api/application/controller"
	"github.com/iiurydias/challenge-bravo/api/application/handlers"
	"github.com/iiurydias/challenge-bravo/api/cache"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"net/http"
	"time"
)

type Application struct {
	httpServer  *http.Server
	cacheModule cache.Cache
}

func New(c *Config) (*Application, error) {
	var api Application
	grpcClient, err := client.New(c.GrpcServer)
	if err != nil {
		return nil, errors.Wrap(err, "failed to instance grpc client")
	}
	cacheModule, err := cache.New(c.Cache)
	if err != nil {
		return nil, err
	}
	currencyController := controller.New(grpcClient, cacheModule)
	currencyHandlers := handlers.New(currencyController)
	router := initializeApiRouter(currencyHandlers)
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", c.ServerPort),
		Handler: router,
	}
	api.httpServer = srv
	api.cacheModule = cacheModule
	return &api, nil
}

func (a *Application) Run() <-chan error {
	apiErrorChan := make(chan error)
	go func() {
		defer close(apiErrorChan)
		err := a.httpServer.ListenAndServe()
		if err != nil {
			apiErrorChan <- err
		}
	}()
	return apiErrorChan
}

func (a *Application) Shutdown() {
	timeout, cancelFunc := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelFunc()
	var accumulatedErrors error
	if err := a.httpServer.Shutdown(timeout); err != nil {
		accumulatedErrors = errors.Wrap(err, "failed to shutdown http server")
	}
	if err := a.cacheModule.Close(); err != nil {
		accumulatedErrors = errors.Wrap(err, "failed to close cache client")
	}
	if accumulatedErrors != nil {
		log.Errorln(accumulatedErrors)
	}
}
