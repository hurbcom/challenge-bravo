package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/victorananias/challenge-bravo/api"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/requests"
	"github.com/victorananias/challenge-bravo/responses"
)

func CreateHandler(responseWriter http.ResponseWriter, request *http.Request) {
	var rate requests.CreateRateRequest

	err := json.NewDecoder(request.Body).Decode(&rate)
	if err != nil {
		http.Error(responseWriter, err.Error(), http.StatusBadRequest)
		return
	}
}

func ConversionsHandler(responseWriter http.ResponseWriter, request *http.Request) {
	sourceCurrency := request.URL.Query().Get("from")
	targetCurrency := request.URL.Query().Get("to")
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 32)

	if err != nil {
		respondWithJson(responseWriter, responses.NewErrorMessageResponse("error parsing amount"), http.StatusBadRequest)
		return
	}

	exchangesRepository := repositories.NewExchangesRepository()
	rate, repositoryErr := exchangesRepository.GetExchange(sourceCurrency, targetCurrency)

	if repositoryErr != nil && repositoryErr.Error() != repositories.NoDocumentInResultErrMessage {
		respondWithJson(responseWriter, responses.NewErrorMessageResponse(err.Error()), http.StatusInternalServerError)
		return
	}

	today := time.Now()
	if rate.UpdatedAt.Year() == today.Year() &&
		rate.UpdatedAt.YearDay() == today.YearDay() {
		convertedAmount := amount * rate.Value
		respondWithJson(responseWriter, responses.NewConversionsResponse(convertedAmount, targetCurrency), http.StatusOK)
		return
	}

	exchangeApi := api.NewApi()
	res, err := exchangeApi.CurrentValue(sourceCurrency, targetCurrency)

	if err != nil {
		if errors.Is(err, api.RateUnavailableError) && repositoryErr == nil {
			convertedAmount := amount * rate.Value
			respondWithJson(responseWriter, responses.NewConversionsResponse(convertedAmount, targetCurrency), http.StatusOK)
			return
		}
		respondWithJson(responseWriter, responses.NewErrorMessageResponse(err.Error()), http.StatusInternalServerError)
		return
	}

	rate = models.Rate{
		Code:                sourceCurrency,
		Value:               res.Rates[targetCurrency],
		BackingCurrencyCode: targetCurrency,
	}
	err = exchangesRepository.Create(rate)
	if err != nil {
		respondWithJson(responseWriter, responses.NewErrorMessageResponse(err.Error()), http.StatusBadRequest)
		return
	}

	convertedAmount := amount * rate.Value
	respondWithJson(responseWriter, responses.NewConversionsResponse(convertedAmount, targetCurrency), http.StatusOK)
}

func respondWithJson(responseWriter http.ResponseWriter, i interface{}, status int) {
	jsonResponse, _ := json.Marshal(i)
	(responseWriter).WriteHeader(status)
	_, err := (responseWriter).Write(jsonResponse)
	if err != nil {
		http.Error((responseWriter), err.Error(), http.StatusBadRequest)
	}
}
