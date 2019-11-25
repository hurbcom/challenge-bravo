package app

import (
	"fmt"
	"time"

	"github.com/gabrielerzinger/challenge-bravo/repositories"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"

	"net/http"
)

// App represents the application holder
type App struct {
	Address string
	Logger  logrus.FieldLogger
	Router  *mux.Router
	Server  *http.Server
	Storage repositories.Repository
}

// NewApp creates a new application instance
func NewApp(host string, port int) *App {
	var log = logrus.New()

	cmdLogger := log.WithFields(logrus.Fields{
		"timestamp": time.Now().Format("15:04"),
	})

	cmdLogger.Info("starting the app...")

	app := &App{
		Address: fmt.Sprintf("%s:%d", host, port),
		Logger:  cmdLogger,
	}

	app.configureApp()

	return app
}

func (a *App) configureApp() {
	a.Router = a.instantiateRouter()
	a.Logger.Info("Connecting to repository...")
	a.Storage = repositories.NewRedisStorage()
	err := a.Storage.Connect()
	if err != nil {
		panic("Failed to connect")
	}
	a.configureServer()
}

func (a *App) configureServer() {
	a.Server = &http.Server{
		Addr:    a.Address,
		Handler: a.Router,
	}
}

func (a *App) instantiateRouter() *mux.Router {
	router := mux.NewRouter()
	router.Handle("/exchange", NewConversionHandler(a)).Methods("GET")
	router.Handle("/currency", NewCurrencyHandler(a)).Methods("POST")
	router.Handle("/currency/{symbol}", NewDeleteHandler(a)).Methods("DELETE")
	return router
}

// Init starts the http server
func (a *App) Init() {
	a.Server.ListenAndServe()
}
