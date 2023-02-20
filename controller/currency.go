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
	"strconv"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
)

type Currency struct{}

func NewCurrency() *Currency {
	return &Currency{}
}

// swagger:route GET /currency/{id} Moedas Obter
// Retorna as informações da moeda solicitada
// responses:
//  default: errorResponse
//  200: currencyResponse

// ProductList returns all products from the data store
func (controllerCurrency *Currency) Get(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currency{
		ID:            1,
		Currency:      "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}
	json.NewEncoder(rw).Encode(currency)
}

// swagger:route GET /currency Moedas Listar
// Retorna as informações de todas as moedas
// responses:
//
//	default: errorResponse
//	200: currenciesResponse

func (controllerCurrency *Currency) List(rw http.ResponseWriter, req *http.Request) {
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

// swagger:route POST /currency/{id} Moedas Incluir
// Adiciona uma nova moeda
// responses:
//
//	default: errorResponse
//	201: currencyResponse
func (controllerCurrency *Currency) Insert(rw http.ResponseWriter, req *http.Request) {
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

// swagger:route PUT /currency/{id} Moedas Alterar
// Atualiza as informações da moeda solicitada
// responses:
//
//	default: errorResponse
//	200: currencyResponse
func (controllerCurrency *Currency) Update(rw http.ResponseWriter, req *http.Request) {
	currency := model.Currency{
		ID:            1,
		Currency:      "USD",
		RateUSD:       1,
		ReferenceDate: time.Now().UTC(),
		CreatedAt:     time.Now().UTC(),
	}
	json.NewEncoder(rw).Encode(currency)
}

// swagger:route DELETE /currency/{id} Moedas Excluir
// Apaga a moeda solicitada
// responses:
//
//	default: errorResponse
//	201: noContentResponse
func (controllerCurrency *Currency) Delete(rw http.ResponseWriter, req *http.Request) {
	rw.WriteHeader(http.StatusNoContent)
}

// swagger:route GET /currency/convert?from=BTC&to=EUR&amount=123.45 Moedas Converter
// Conversão de valor entre moedas
// responses:
//
//	default: errorResponse
//	200: noContentResponse
func (controllerCurrency *Currency) Convert(rw http.ResponseWriter, req *http.Request) {
	amount, _ := strconv.ParseFloat(req.URL.Query().Get("amount"), 32)

	response := convert{
		CurrencyFrom: req.URL.Query().Get("from"),
		CurrencyTo:   req.URL.Query().Get("to"),
		Amount:       float32(amount),
	}

	json.NewEncoder(rw).Encode(response)
}

type convert struct {
	CurrencyFrom string
	CurrencyTo   string
	Amount       float32
}
