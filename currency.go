package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/victorananias/challenge-bravo/api"
	"github.com/victorananias/challenge-bravo/responses"
)

func Get(responseWriter http.ResponseWriter, request *http.Request) {
	to := request.URL.Query().Get("to")
	from := request.URL.Query().Get("from")
	value, err := strconv.ParseFloat(request.URL.Query().Get("value"), 32)
	if err != nil {
		respondWithJson(responseWriter, responses.DefaultResponse{
			Message: "error parsing value",
		}, http.StatusBadRequest)
		return
	}

	api := api.NewApi()

	res, err := api.CurrentValue(from, to)

	if err != nil {
		respondWithJson(responseWriter, responses.DefaultResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}
	convertedValue := value * res.Quotes[from+to]

	respondWithJson(responseWriter, responses.ConversionResponse{
		Value:    convertedValue,
		Currency: to,
	}, http.StatusOK)
}

func respondWithJson(responseWriter http.ResponseWriter, i interface{}, status int) {
	jsonResponse, _ := json.Marshal(i)
	(responseWriter).WriteHeader(status)
	_, err := (responseWriter).Write(jsonResponse)
	if err != nil {
		http.Error((responseWriter), err.Error(), http.StatusBadRequest)
	}
}
