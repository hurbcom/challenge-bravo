package application

import (
	"context"
	"fmt"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	"github.com/iiurydias/challenge-bravo/api/application/controllers/currency"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"net/http"
	"time"
)

type Application struct {
	httpServer *http.Server
}

func New(c *Config) (*Application, error) {
	api := &Application{}
	grpcClient, err := client.New(c.GrpcServer)
	if err != nil {
		return nil, errors.Wrap(err, "failed to instance grpc client")
	}
	controller := currency.New(grpcClient)
	r := initializeApiRouter(controller)
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", c.ServerPort),
		Handler: r,
	}
	api.httpServer = srv
	return api, nil
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
	err := a.httpServer.Shutdown(timeout)
	if err != nil {
		log.Errorln(errors.Wrap(err, "failed to shutdown http server"))
	}
}
