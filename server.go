package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/route"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/router"
	cache "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache/redis"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database"
	repository "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository/postgres"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
	gohandlers "github.com/gorilla/handlers"
	"github.com/hashicorp/go-hclog"
)

func main() {
	// create a new logger
	log := hclog.New(&hclog.LoggerOptions{
		Name:       "hurbcom-currency",
		JSONFormat: false,
		Level:      hclog.LevelFromString("DEBUG"),
	})

	// load configs
	config, err := util.LoadConfig(".")

	if err != nil {
		log.Error("Cannot load application configs", "error", err)
		return
	}

	log.Info("Configs loaded successfuly")

	// update logger with new options
	log = hclog.New(&hclog.LoggerOptions{
		Name:       "hurbcom-currency",
		JSONFormat: config.ServerLogJSONFormat,
		Level:      hclog.LevelFromString(config.ServerLogLevel),
	})

	// run database migration
	err = database.DBMigrationRun(config.DBURL, config.DBMigrationURL)

	if err != nil {
		log.Error("Cannot run db migration", "error", err)
		os.Exit(1)
	}

	log.Info("DB migration run successfuly")

	// create a new repository
	repository, err := repository.NewPostgres(config)

	if err != nil {
		log.Error("Cannot connect to database", "error", err)
		os.Exit(1)
	}

	defer repository.Close()

	log.Info("Connected database successfuly")

	// create a new cache
	cache, err := cache.NewRedis(config)

	if err != nil {
		log.Error("Cannot connect to cache", "error", err)
		os.Exit(1)
	}

	defer cache.Close()

	log.Info("Connected cache successfuly")

	// set server address
	serverAddr := config.ServerAddress

	// create a new router
	appRouter := router.NewMuxRouter()

	// include the routes
	route.CurrencyRoute(appRouter, log, repository, cache)
	route.SwaggerRoute(appRouter)

	// create HTTP handler
	httpHandler := appRouter.Serve()

	// include the middleware handler CORS
	corsHandler := gohandlers.CORS(gohandlers.AllowedOrigins([]string{""}))
	httpHandler = corsHandler(httpHandler)

	// include the middleware handler logger
	httpHandler = router.HttpLogger(httpHandler, log)

	// create a new server
	httpServer := http.Server{
		Addr:    serverAddr,
		Handler: httpHandler,
		// ErrorLog: log,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// start the server
	go func() {
		log.Info(fmt.Sprintf("HTTP server running on port %v", serverAddr))

		err := httpServer.ListenAndServe()

		if err != nil {
			log.Error("Error running HTTP server", "error", err)
			os.Exit(1)
		}
	}()

	// trap sigterm or interupt and gracefully shutdown the server
	chanGracefully := make(chan os.Signal, 1)
	signal.Notify(chanGracefully, os.Interrupt)
	signal.Notify(chanGracefully, os.Kill)

	// Block until a signal is received.
	sig := <-chanGracefully
	log.Info(fmt.Sprintf("HTTP server terminate signal %v", sig))

	// gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	httpServer.Shutdown(ctx)
}
