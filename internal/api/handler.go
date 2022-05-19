package api

import (
	"context"
	"net/http"

	coreMiddleware "challenge-bravo/pkg/core/http/middleware"

	"challenge-bravo/internal/container"
	"challenge-bravo/pkg/domains/currencyconversion/transport"

	chi "github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func Handler(ctx context.Context, dep *container.Dependency) http.Handler {
	r := chi.NewMux()

	r.Use(middleware.RequestID)
	r.Use(coreMiddleware.Logger(dep.Components.Log))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {})

	currencyConversionHandler := transport.NewHTTPHandler(dep.Services.CurrencyConversion)
	r.Mount("/currency", currencyConversionHandler)

	return r
}
