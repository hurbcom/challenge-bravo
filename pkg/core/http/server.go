/*
Package server is the package responsible for http server
*/
package server

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"reflect"
	"syscall"
	"time"

	ilog "challenge-bravo/pkg/core/log"
	"challenge-bravo/pkg/core/types"
)

// PrefixConfig is the environment prefix ex: HOST_PORT will be added API_ as prefix.
const PrefixConfig = "API_"

// Config is the API Server Configuration.
type Config struct {
	Addr             string        `env:"HOST_PORT,required"`
	GracefulDuration time.Duration `env:"GRACEFUL_WAIT_TIME,required"`
}

// Run the server http.
func Run(ctx context.Context, cnf Config, handler http.Handler, log ilog.Logger) {
	server := &http.Server{Addr: cnf.Addr, Handler: handler}

	// Server run context.
	serverCtx, serverStopCtx := context.WithCancel(ctx)

	// Listen for syscall signals for process to interrupt/quit.
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	go func() {
		<-sig

		shutdownCtx, cancel := context.WithTimeout(serverCtx, cnf.GracefulDuration)
		defer cancel()

		go func() {
			<-shutdownCtx.Done()
			if errors.Is(shutdownCtx.Err(), context.DeadlineExceeded) {
				log.Fatal(ctx, "graceful shutdown timed out, forcing exit")
			}
		}()

		// Trigger graceful shutdown
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Fatal(ctx, "shutdown error", ilog.Error(err))
		}
		serverStopCtx()
	}()

	startingMessage(ctx, cnf.Addr, log)

	if err := server.ListenAndServe(); errors.Is(err, http.ErrServerClosed) {
		log.Warn(ctx, "HTTP server requested to stop")
	} else {
		log.Error(ctx, "HTTP server stopped with error", ilog.Error(err))
	}

	// Wait for server context to be stopped
	<-serverCtx.Done()
}

func startingMessage(ctx context.Context, where string, log ilog.Logger) {
	t, ok := ctx.Value(types.ContextKey(types.StartedAt)).(time.Time)
	if !ok {
		log.Warn(ctx, "could not get startedTime time",
			ilog.Any("type of startedAt", reflect.TypeOf(ctx.Value(types.ContextKey(types.StartedAt)))),
		)
	}

	log.Info(
		ctx,
		"Starting API Server",
		ilog.Any("bind", where),
		ilog.Any("start time", t),
	)
}
