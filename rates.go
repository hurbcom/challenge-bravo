package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/victorananias/challenge-bravo/api"
	"github.com/victorananias/challenge-bravo/models"
	"github.com/victorananias/challenge-bravo/repositories"
	"github.com/victorananias/challenge-bravo/requests"
	"github.com/victorananias/challenge-bravo/responses"
	"github.com/victorananias/challenge-bravo/settings"
)

func CreateHandler(responseWriter http.ResponseWriter, request *http.Request) {
	var rateRequest requests.CreateRateRequest

	err := json.NewDecoder(request.Body).Decode(&rateRequest)
	if err != nil {
		http.Error(responseWriter, err.Error(), http.StatusBadRequest)
		return
	}
	exchangesRepository := repositories.NewExchangesRepository()

	rate := models.Rate{
		Code:                rateRequest.CurrencyCode,
		Value:               rateRequest.Value,
		BackingCurrencyCode: rateRequest.BackingCurrencyCode,
	}
	err = exchangesRepository.CreateOrUpdate(rate)
	if err != nil {
		respondWithJson(responseWriter, responses.NewMessageResponse(err.Error()), http.StatusBadRequest)
		return
	}

	respondWithJson(responseWriter, responses.NewMessageResponse("rate created"), http.StatusCreated)
}

func DeleteHandler(responseWriter http.ResponseWriter, request *http.Request) {
	code := strings.TrimPrefix(request.URL.Path, "/")
	exchangesRepository := repositories.NewExchangesRepository()

	err := exchangesRepository.DeleteByCurrencyCode(code)
	if err != nil {
		respondWithJson(responseWriter, responses.NewMessageResponse(err.Error()), http.StatusBadRequest)
		return
	}

	respondWithJson(responseWriter, responses.NewMessageResponse("rate deleted"), http.StatusOK)
}

func ConversionsHandler(responseWriter http.ResponseWriter, request *http.Request) {
	sourceCurrency := request.URL.Query().Get("from")
	targetCurrency := request.URL.Query().Get("to")
	amount, err := strconv.ParseFloat(request.URL.Query().Get("amount"), 32)

	if err != nil {
		respondWithJson(responseWriter, responses.NewMessageResponse("error parsing amount"), http.StatusBadRequest)
		return
	}

	sourceRate, err := getRate(sourceCurrency)
	if err != nil {
		respondWithJson(responseWriter, responses.NewMessageResponse(err.Error()), http.StatusBadRequest)
		return
	}
	targetRate, err := getRate(targetCurrency)
	if err != nil {
		respondWithJson(responseWriter, responses.NewMessageResponse(err.Error()), http.StatusBadRequest)
		return
	}

	convertedAmount := convert(amount, sourceRate, targetRate)
	respondWithJson(responseWriter, responses.NewConversionsResponse(convertedAmount, targetCurrency), http.StatusOK)
}

func getRate(currency string) (models.Rate, error) {
	settings, _ := settings.NewSettings()
	if currency == settings.BackingCurrencyCode {
		return models.Rate{Code: currency, Value: 1, BackingCurrencyCode: currency}, nil
	}
	var rate models.Rate
	exchangesRepository := repositories.NewExchangesRepository()
	rate, err := exchangesRepository.GetRate(currency, settings.BackingCurrencyCode)

	if err == nil {
		today := time.Now()
		if rate.UpdatedAt.Year() == today.Year() &&
			rate.UpdatedAt.YearDay() == today.YearDay() {
			return rate, nil
		}

		exchangeApi := api.NewApi()
		apiResult, err := exchangeApi.CurrentValue(currency, settings.BackingCurrencyCode)

		if err != nil {
			if errors.Is(err, api.ErrRateUnavailable) {
				return rate, err
			}
			exchangesRepository.CreateOrUpdate(rate)
			return rate, nil
		}

		rate = models.Rate{
			Code:                currency,
			Value:               apiResult.Rates[settings.BackingCurrencyCode],
			BackingCurrencyCode: settings.BackingCurrencyCode,
		}
		err = exchangesRepository.CreateOrUpdate(rate)
		if err != nil {
			return rate, err
		}
		return rate, nil
	}

	if errors.Is(err, repositories.ErrNoDocumentFound) {
		exchangeApi := api.NewApi()
		res, err := exchangeApi.CurrentValue(currency, settings.BackingCurrencyCode)

		if err != nil {
			return rate, err
		}

		rate = models.Rate{
			Code:                currency,
			Value:               res.Rates[settings.BackingCurrencyCode],
			BackingCurrencyCode: settings.BackingCurrencyCode,
		}

		err = exchangesRepository.CreateOrUpdate(rate)
		if err != nil {
			return rate, err
		}
		return rate, nil
	}
	return rate, err
}

func convert(amount float64, sourceRate, targetRate models.Rate) float64 {
	return amount * sourceRate.Value / (1 / targetRate.Value)
}

func respondWithJson(responseWriter http.ResponseWriter, i interface{}, status int) {
	jsonResponse, _ := json.Marshal(i)
	responseWriter.WriteHeader(status)
	_, err := responseWriter.Write(jsonResponse)
	if err != nil {
		http.Error(responseWriter, err.Error(), http.StatusBadRequest)
	}
}
