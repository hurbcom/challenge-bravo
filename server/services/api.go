package services

import (
	"challenge-bravo/models"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

func ExchangeAPI(currencyCode string) (float64, error) {
	response, err := http.Get("https://api.exchangeratesapi.io/latest?base=USD")
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	var api models.APIResponse
	json.Unmarshal(body, &api)

	return api.Rates[currencyCode], nil
}
