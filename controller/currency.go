// Package classification API de Moedas.
//
// Documentação da API de Moedas
//
//	Schemes: http
//	BasePath: /
//	Version: 1.0.0
//
//	Consumes:
//	- application/json
//
//	Produces:
//	- application/json
//
// swagger:meta
package controller

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
)

// Retorna as informações da Moeda solicitada
// swagger:response currencyResponse
type currencyResponseWrapper struct {
	// Informações da Moeda
	// in: body
	Body struct {
		model.Currency
	}
}

// Retorna as informações de todas as Moedas
// swagger:response currenciesResponse
type currenciesResponseWrapper struct {
	// Todas as Moedas
	// in: body
	Body struct {
		model.Currencies
	}
}

type Currency struct{}

func NewCurrency() *Currency {
	return &Currency{}
}

// swagger:route GET /currency/{id} Moedas Obter
// Retorna as informações da moeda solicitada
// responses:
//	200: currencyResponse

func (currencyController *Currency) Get(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currency{
		ID:            1,
		Currency:      "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}
	json.NewEncoder(rw).Encode(currency)
}

//	swagger:route GET /currency Moedas Listar
//	Retorna as informações de todas as moedas
//	responses:
//		200: currenciesResponse

func (currencyController *Currency) List(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currencies{
		model.Currency{
			ID:            1,
			Currency:      "USD",
			RateUSD:       1,
			ReferenceDate: time.Now().UTC(),
			CreatedAt:     time.Now().UTC(),
		},
		model.Currency{
			ID:            1,
			Currency:      "USD",
			RateUSD:       1,
			ReferenceDate: time.Now().UTC(),
			CreatedAt:     time.Now().UTC(),
		},
	}
	json.NewEncoder(rw).Encode(currency)
}

func (currencyController *Currency) Insert(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currency{
		ID:            1,
		Currency:      "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}

	rw.WriteHeader(http.StatusCreated)
	json.NewEncoder(rw).Encode(currency)
}

func (currencyController *Currency) Update(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currency{
		ID:            1,
		Currency:      "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}
	json.NewEncoder(rw).Encode(currency)
}

func (currencyController *Currency) Delete(rw http.ResponseWriter, req *http.Request) {
	rw.WriteHeader(http.StatusNoContent)
}
