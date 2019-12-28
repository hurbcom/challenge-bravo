package http

import (
	"conversion-api/currency"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
)

type handler struct {
	service currency.Service
}

//NewHandler instantiate a handler and fix it with the router
func NewHandler(s currency.Service, r *chi.Mux) {
	h := handler{
		service: s,
	}

	h.AssignRoute(r)
}

func (h *handler) ExchangeCurrency(w http.ResponseWriter, r *http.Request) {
	from, err := h.getQueryParam("from", r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	to, err := h.getQueryParam("to", r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	amountString, err := h.getQueryParam("amount", r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	amount, err := strconv.ParseFloat(amountString, 64)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	exchange, err := h.service.ExchangeCurrency(context.Background(), from, to, amount)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(exchange)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(res)
	return
}

func (h *handler) UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	currencyName, err := h.getQueryParam("currency", r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	currency, err := h.service.UpdateCurrency(context.Background(), currencyName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(currency)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(res)
	return
}

func (h *handler) CreateCurrency(w http.ResponseWriter, r *http.Request) {
	currencyName, err := h.getQueryParam("currency", r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	currency, err := h.service.CreateCurrency(context.Background(), currencyName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(currency)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(res)
	return
}

func (h *handler) getQueryParam(key string, r *http.Request) (string, error) {
	keys, ok := r.URL.Query()[key]

	if !ok || len(keys[0]) < 1 {
		return "", fmt.Errorf("Url Param 'key' is missing")
	}

	return keys[0], nil
}
