package app

import (
	"github.com/ednailson/challenge-bravo/controller"
	"github.com/ednailson/challenge-bravo/currency"
	"github.com/ednailson/challenge-bravo/handlers"
	"github.com/ednailson/httping-go"
	log "github.com/sirupsen/logrus"
)

type App struct {
	server    httping.IServer
	closeFunc httping.ServerCloseFunc
}

func LoadApp() (*App, error) {
	currencyModule, err := currency.NewCurrency()
	if err != nil {
		return nil, err
	}
	server := loadServer(controller.NewController(currencyModule))
	return &App{server: server}, nil
}

func loadServer(ctrl *controller.Controller) httping.IServer {
	server := httping.NewHttpServer("", 8080)
	server.NewRoute(nil, "/v1/convert").GET(handlers.Convert(ctrl))
	currencyRoute := server.NewRoute(nil, "/v1/currency/:currency")
	currencyRoute.POST(handlers.AddCurrency(ctrl))
	currencyRoute.DELETE(handlers.DeleteCurrency(ctrl))
	return server
}

func (a *App) Run() chan error {
	closeFunc, chErr := a.server.RunServer()
	a.closeFunc = closeFunc
	return chErr
}

func (a *App) Close() {
	err := a.closeFunc()
	if err != nil {
		log.WithField("error", err.Error()).Errorf("failed to close func")
	}
}
