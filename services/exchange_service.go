package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

// reference: https://exchangerate.host/#/docs
var BASE_CURRENCY = "USD"
var BASE_URL = "https://api.exchangerate.host/latest?base=%s&symbols=%s"

type ExchangeResult struct {
	Motd    map[string]string
	Success bool
	Base    string
	date    string
	Rates   map[string]float32
}

func DoGetExchangeRate(toCurrency string) (ExchangeResult, error) {
	client := http.Client{}
	baseUrl := fmt.Sprintf(BASE_URL, BASE_CURRENCY, toCurrency)
	request, err := http.NewRequest("GET", baseUrl, nil)
	if err != nil {
		return ExchangeResult{}, errors.New("An error occurred to create new request")
	}

	resp, err := client.Do(request)
	if err != nil {
		return ExchangeResult{}, errors.New("An error occurred to makes the request")
	}

	var exchangeResult ExchangeResult
	json.NewDecoder(resp.Body).Decode(&exchangeResult)

	return exchangeResult, nil
}

func GetCurrencyRate(toCurrency string) (float32, error) {
	result, err := DoGetExchangeRate(toCurrency)
	if err != nil {
		return 0, err
	}

	if result.Rates[toCurrency] == 0 {
		return 0, errors.New("Can not find target currency rate")
	}

	return result.Rates[toCurrency], nil
}
