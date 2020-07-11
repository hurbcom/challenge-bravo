package rest

import (
	"github.com/go-chi/chi"

	"github.com/hurbcom/challenge-bravo/pkg/coin"

	"net/http"
)

// @title Challenge Bravo API
// @version 1.0
// @description Specification for all resource from Coins API

// @BasePath /api
func NewRouter(cs coin.Service) http.Handler {
	router := chi.NewRouter()

	router.Route("/api", func(api chi.Router) {
		api.Route("/v1", func(v1 chi.Router) {
			v1.Get("/coins/convert", v1ConvertCoinValue(cs))
		})
	})

	return router
}
