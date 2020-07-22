package rest

import (
	"github.com/go-chi/chi"

	"github.com/hurbcom/challenge-bravo/pkg/currency"

	"net/http"
)

// @title Challenge Bravo API
// @version 1.0
// @description Specification for all resource from Challenge Bravo API

// @BasePath /api
func NewRouter(cs currency.PrimaryPort) http.Handler {
	router := chi.NewRouter()

	router.Route("/api", func(api chi.Router) {
		api.Route("/v1", func(v1 chi.Router) {
			v1.Get("/currency/convert", v1ConvertCurrencyValue(cs))
		})
	})

	return router
}
