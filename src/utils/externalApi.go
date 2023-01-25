package utils

import (
	"challenge-bravo/src/models"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type ExternalApi struct {
	URL    string
	Method string
}

var client = http.Client{}

func (api ExternalApi) GetCurrenciesFromApi() ([]models.Currency, error) {
	request, err := http.NewRequest(api.Method, api.URL+"pricemulti", nil)
	if err != nil {
		return []models.Currency{}, err
	}

	q := request.URL.Query()
	q.Add("fsyms", "BRL,BTC,ETH,USD,EUR")
	q.Add("tsyms", "USD")

	request.URL.RawQuery = q.Encode()

	response, err := client.Do(request)
	if err != nil {
		return []models.Currency{}, err
	}

	getBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return []models.Currency{}, err
	}

	defer response.Body.Close()

	var maps map[string]map[string]float64

	if err = json.Unmarshal(getBody, &maps); err != nil {
		return []models.Currency{}, err
	}

	var currencies []models.Currency
	for code, value := range maps {
		var currency models.Currency

		currency.Code = code
		currency.Bid = value["USD"]

		currencies = append(currencies, currency)
	}

	return currencies, nil
}

func (api ExternalApi) FindCurrencyFromApi(currencyCode string) (models.Currency, error) {
	request, err := http.NewRequest(api.Method, api.URL+"price", nil)
	if err != nil {
		return models.Currency{}, err
	}

	q := request.URL.Query()
	q.Add("fsym", currencyCode)
	q.Add("tsyms", "USD")

	request.URL.RawQuery = q.Encode()

	response, err := client.Do(request)
	if err != nil {
		return models.Currency{}, err
	}

	defer response.Body.Close()

	getBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return models.Currency{}, err
	}

	var maps map[string]float64

	if err = json.Unmarshal(getBody, &maps); err != nil {
		return models.Currency{}, err
	}

	var currency = models.Currency{
		Code: currencyCode,
		Bid:  maps["USD"],
	}

	return currency, nil
}
