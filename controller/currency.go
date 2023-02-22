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
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	logger "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/logger"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/usecase"
	"github.com/hashicorp/go-hclog"
)

type Currency struct {
	useCaseCurrency usecase.Currency
	log             hclog.Logger
}

func NewCurrency(useCaseCurrency usecase.Currency, log hclog.Logger) *Currency {
	return &Currency{
		useCaseCurrency: useCaseCurrency,
		log:             log,
	}
}

// swagger:route POST /currency Moedas Incluir
// Adiciona uma nova moeda
// responses:
//
//	default: errorResponse
//	201: currencyResponse
func (controllerCurrency *Currency) Insert(rw http.ResponseWriter, req *http.Request) {

	currency := &model.Currency{}

	err := json.NewDecoder(req.Body).Decode(currency)

	if err != nil {
		responseError := &model.Error{
			Code:    400.1,
			Message: "Error deserializing currency",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	currencyResult, err := controllerCurrency.useCaseCurrency.Insert(currency)

	if err != nil {
		var responseError *model.Error
		if _, ok := err.(usecase.ErrCurrencyValidate); ok {
			responseError = &model.Error{
				Code:    400.2,
				Message: fmt.Sprintf("Error validating currency: %v", err.Error()),
			}

			rw.WriteHeader(http.StatusBadRequest)
		} else if _, ok := err.(repository.ErrDuplicateKey); ok {
			responseError = &model.Error{
				Code:    400.5,
				Message: fmt.Sprintf("Error insert currency in database: %v", err.Error()),
			}

			rw.WriteHeader(http.StatusBadRequest)
		} else {
			responseError = &model.Error{
				Code:    500.1,
				Message: "Error insert currency in database",
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(rw).Encode(responseError)
		return
	}

	rw.WriteHeader(http.StatusCreated)
	json.NewEncoder(rw).Encode(currencyResult)
}

// swagger:route GET /currency/{id} Moedas Obter
// Retorna as informações da moeda solicitada
// responses:
//  default: errorResponse
//  200: currencyResponse

// ProductList returns all products from the data store
func (controllerCurrency *Currency) GetByID(rw http.ResponseWriter, req *http.Request) {
	id, err := strconv.Atoi(strings.Split(req.URL.Path, "/")[2])

	if err != nil {
		responseError := &model.Error{
			Code:    400.3,
			Message: "Invalid ID",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	currencyResult, err := controllerCurrency.useCaseCurrency.GetByID(int64(id))

	if err != nil {
		var responseError *model.Error
		if _, ok := err.(repository.ErrNotFound); ok {
			responseError = &model.Error{
				Code:    404.1,
				Message: "Not Found",
			}

			rw.WriteHeader(http.StatusNotFound)
		} else {
			responseError = &model.Error{
				Code:    500.2,
				Message: "Error get currency from database",
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(rw).Encode(responseError)
		return
	}

	json.NewEncoder(rw).Encode(currencyResult)
}

// swagger:route GET /currency Moedas Listar
// Retorna as informações de todas as moedas
// responses:
//
//	default: errorResponse
//	200: currenciesResponse

func (controllerCurrency *Currency) List(rw http.ResponseWriter, req *http.Request) {
	currencies, err := controllerCurrency.useCaseCurrency.List()

	if err != nil {
		responseError := &model.Error{
			Code:    500.3,
			Message: "Error get all currencies from database",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	json.NewEncoder(rw).Encode(currencies)
}

// swagger:route PUT /currency/{id} Moedas Alterar
// Atualiza as informações da moeda solicitada
// responses:
//
//	default: errorResponse
//	200: currencyResponse
func (controllerCurrency *Currency) Update(rw http.ResponseWriter, req *http.Request) {
	id, err := strconv.Atoi(strings.Split(req.URL.Path, "/")[2])

	if err != nil {
		responseError := &model.Error{
			Code:    400.3,
			Message: "Invalid ID",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	currency := &model.Currency{}

	err = json.NewDecoder(req.Body).Decode(currency)

	if err != nil {
		responseError := &model.Error{
			Code:    400.1,
			Message: "Error deserializing currency",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	if currency.ID != 0 && currency.ID != int64(id) {
		responseError := &model.Error{
			Code:    400.4,
			Message: "URL Path ID divergent currency.ID",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	currency.ID = int64(id)

	currencyResult, err := controllerCurrency.useCaseCurrency.Update(currency)

	if err != nil {
		var responseError *model.Error

		if _, ok := err.(usecase.ErrCurrencyValidate); ok {
			responseError = &model.Error{
				Code:    400.2,
				Message: fmt.Sprintf("Error validating currency: %v", err.Error()),
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusBadRequest)
		} else if _, ok := err.(repository.ErrNotFound); ok {
			responseError = &model.Error{
				Code:    404.1,
				Message: "Not Found",
			}

			rw.WriteHeader(http.StatusNotFound)
		} else if _, ok := err.(repository.ErrDuplicateKey); ok {
			responseError = &model.Error{
				Code:    400.5,
				Message: fmt.Sprintf("Error update currency in database: %v", err.Error()),
			}

			rw.WriteHeader(http.StatusBadRequest)
		} else {
			responseError = &model.Error{
				Code:    500.4,
				Message: "Error update currency in database",
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(rw).Encode(responseError)
		return
	}

	json.NewEncoder(rw).Encode(currencyResult)
}

// swagger:route DELETE /currency/{id} Moedas Excluir
// Apaga a moeda solicitada
// responses:
//
//	default: errorResponse
//	204: noContentResponse
func (controllerCurrency *Currency) Delete(rw http.ResponseWriter, req *http.Request) {
	id, err := strconv.Atoi(strings.Split(req.URL.Path, "/")[2])

	if err != nil {
		responseError := &model.Error{
			Code:    400.3,
			Message: "Invalid ID",
		}

		logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(responseError)
		return
	}

	err = controllerCurrency.useCaseCurrency.Delete(int64(id))

	if err != nil {
		var responseError *model.Error

		if _, ok := err.(repository.ErrNotFound); ok {
			responseError = &model.Error{
				Code:    404.1,
				Message: "Not Found",
			}

			rw.WriteHeader(http.StatusNotFound)
		} else {
			responseError = &model.Error{
				Code:    500.5,
				Message: "Error delete currency in database",
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(rw).Encode(responseError)
		return
	}

	rw.WriteHeader(http.StatusNoContent)
}

// swagger:route GET /currency/convert?from=USD&to=BRL&amount=1.25 Moedas Converter
// Conversão de valor entre moedas
// responses:
//
//	default: errorResponse
//	200: CurrencyConvertResponse
func (controllerCurrency *Currency) Convert(rw http.ResponseWriter, req *http.Request) {
	amount, _ := strconv.ParseFloat(req.URL.Query().Get("amount"), 32)

	currencyConvert := &model.CurrencyConvert{
		From:   req.URL.Query().Get("from"),
		To:     req.URL.Query().Get("to"),
		Amount: float32(amount),
	}

	currencyConvertResponse, err := controllerCurrency.useCaseCurrency.Convert(currencyConvert)

	if err != nil {
		var responseError *model.Error

		if _, ok := err.(usecase.ErrCurrencyConvertValidate); ok {
			responseError = &model.Error{
				Code:    400.2,
				Message: fmt.Sprintf("Error validating parameters: %v", err.Error()),
			}

			rw.WriteHeader(http.StatusBadRequest)
		} else {
			responseError = &model.Error{
				Code:    500.6,
				Message: "Error convert currency",
			}

			logger.LogErrorRequest(controllerCurrency.log, req, responseError.Message, err)

			rw.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(rw).Encode(responseError)
		return
	}

	json.NewEncoder(rw).Encode(currencyConvertResponse)
}
