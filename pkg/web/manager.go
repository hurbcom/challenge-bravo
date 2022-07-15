package web

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/Pedro-Pessoa/challenge-bravo/cmd/env"
	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

const (
	// DefaultAddr is the default addr used
	// by the HTTP Server, if one is not provided.
	DefaultAddr = ":8080"
)

// Manager is the struct used by the whole package.
type Manager struct {
	// addr to listen to
	addr string

	// shutdownChan is the chan used to send/receive a shutdown signal
	shutdownChan chan struct{}
	// hasShutDownChan is the chan used to verify the server has been shutdown
	hasShutDownChan chan bool

	// handler is the HTTP handler
	handler *chi.Mux

	// envData is the loaded env data
	envData env.Data
}

// NewManager creates a new service manager.
// If ctx gets done, the server will be shutdown.
func NewManager(ctx context.Context, db *sqlx.DB, envData env.Data) (*Manager, error) {
	addr := envData.WebserverAddress
	if addr == "" {
		addr = DefaultAddr
	}

	if db == nil {
		return nil, errors.New("can not create server with a nil db")
	}

	store := cache.NewStore[string, *abstract.LiveResponse](15 * time.Minute)
	handler := createMux(db, store, envData.AbstractAPIKey, addr)

	s := &Manager{
		addr:            addr,
		handler:         handler,
		shutdownChan:    make(chan struct{}, 1),
		hasShutDownChan: make(chan bool, 1),
		envData:         envData,
	}

	go func() {
		// If the context gets cancelled,
		// the server is shutdown
		<-ctx.Done()
		s.Shutdown()
	}()

	return s, nil
}

// ListenAndServe starts listening and serving HTTP via the server's addr.
//
// A custom HTTP Server might be provided, but it is not mandatory.
// Note that even if a custom HTTP Server is passed to ListenAndServe,
// the Addr and Handler used will always be the webServer's.
func (m *Manager) ListenAndServe(customHTTPServer *http.Server) error {
	if customHTTPServer == nil {
		customHTTPServer = &http.Server{}
	}

	customHTTPServer.Addr = m.addr
	customHTTPServer.Handler = m.handler

	// handle shutdown inputs
	go func() {
		<-m.shutdownChan

		zap.L().Info("webserver has received a shutdown input")

		ctx, cancel := context.WithTimeout(context.Background(), m.envData.WebserverTimeout)
		defer func() {
			cancel()

			m.hasShutDownChan <- true
		}()
		_ = customHTTPServer.Shutdown(ctx)
	}()

	zap.L().Info("starting webserver")

	err := customHTTPServer.ListenAndServe()
	if err != nil {
		if !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("webserver closed unexpectedly: %w", err)
		}
	}

	return nil
}

// Shutdown shuts the webserver down.
// It will wait until all connections are closed or until
// s.data.WebserverTimeout has passed, whichever happens first.
func (m *Manager) Shutdown() {
	m.shutdownChan <- struct{}{}
	<-m.hasShutDownChan
	zap.L().Info("webserver has been shutdown")
}
