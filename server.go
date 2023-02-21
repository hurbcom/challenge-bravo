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
	gohandlers "github.com/gorilla/handlers"
	"github.com/hashicorp/go-hclog"
)

func main() {
	serverAddr := ":9000"

	log := hclog.Default()

	// create a new router
	appRouter := router.NewMuxRouter()

	// include the routes
	route.CurrencyRoute(appRouter, log)
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
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	httpServer.Shutdown(ctx)
}
