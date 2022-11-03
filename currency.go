package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/responses"
)

func ConversionsHandler(responseWriter http.ResponseWriter, request *http.Request) {
	sourceCurrency := request.URL.Query().Get("from")
	targetCurrency := request.URL.Query().Get("to")
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 32)

	if err != nil {
		sendJson(responseWriter, responses.DefaultResponse{
			Message: "error parsing amount",
			Success: false,
		}, http.StatusBadRequest)
		return
	}

	currenciesRepository := repositories.NewCurrenciesRepository()
	currency, err := currenciesRepository.Get(sourceCurrency, targetCurrency)
	if err != nil {
		sendJson(responseWriter, responses.DefaultResponse{
			Message: err.Error(),
			Success: false,
		}, http.StatusInternalServerError)
		return
	}
	convertedValue := amount * currency.Value
	sendJson(responseWriter, responses.ConversionResponse{
		Value:    convertedValue,
		Currency: targetCurrency,
	}, http.StatusOK)

	// api := api.NewApi()
	// res, err := api.CurrentValue(from, to)

	// if err != nil {
	// 	sendJson(responseWriter, responses.DefaultResponse{
	// 		Message: err.Error(),
	// 		Success: false,
	// 	}, http.StatusInternalServerError)
	// 	return
	// }
	// convertedValue = value * res.Quotes[from+to]

	// sendJson(responseWriter, responses.ConversionResponse{
	// 	Value:    convertedValue,
	// 	Currency: to,
	// }, http.StatusOK)
}

func sendJson(responseWriter http.ResponseWriter, i interface{}, status int) {
	jsonResponse, _ := json.Marshal(i)
	(responseWriter).WriteHeader(status)
	_, err := (responseWriter).Write(jsonResponse)
	if err != nil {
		http.Error((responseWriter), err.Error(), http.StatusBadRequest)
	}
}
