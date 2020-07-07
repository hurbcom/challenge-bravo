package rest

import (
	"github.com/go-chi/chi"

	"github.com/hurbcom/challenge-bravo/pkg/boleto"

	"net/http"
)

// @title Template Go
// @version 1.0
// @description This is a doc from app-api project on commit 674a4556659c360d5ce0f2753b1f9c98100fad06

// @BasePath /api
func NewRouter(bsvc boleto.Service) http.Handler {
	router := chi.NewRouter()

	router.Route("/api", func(api chi.Router) {
		api.Route("/v1alpha", func(v1alpha chi.Router) {
			v1alpha.Get("/boletos", v1alphaRetrieveBoletos(bsvc))
			v1alpha.Get("/boletos/{boleto_id}", v1alphaGetBoleto(bsvc))
			v1alpha.Get("/boletos/{boleto_id}/receipt", v1alphaGetBoletoReceipt(bsvc))
		})
	})

	return router
}
