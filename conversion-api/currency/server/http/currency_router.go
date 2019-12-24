package http

import "github.com/go-chi/chi"

func (h *handler) AssignRoute(r *chi.Mux) {
	r.Route("/currency", func(r chi.Router) {
		r.Get("/exchange", h.ExchangeCurrency)
		r.Put("/update", h.UpdateCurrency)
		r.Post("/create", h.CreateCurrency)
	})
}
