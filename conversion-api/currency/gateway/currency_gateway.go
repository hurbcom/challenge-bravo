package gateway

import (
	"challenge-bravo/conversion-api/currency"
	"time"
	"strconv"
	"challenge-bravo/conversion-api/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type gateway struct {
	baseurl string
}

//NewGateway returns a new instance of gateway to connect to a api
func NewGateway() currency.Gateway {
	return &gateway{
		baseurl: "https://openexchangerates.org/api/latest.json?app_id=fc5abd9d7227492eaad1feb591e6c7fa&base:=USD&prettyprint=true&symbols=",
	}
}

func (g *gateway) GetCurrencyByName(currency string) (models.Currency, error) {
	finalURL := fmt.Sprintf("%s%s", g.baseurl, currency)

	resp, err := http.Get(finalURL)

	if err != nil {
		return models.Currency{}, err
	}

	if resp.StatusCode != http.StatusOK {
		return models.Currency{}, fmt.Errorf("Failed to fetch request, returned status code :%d", resp.StatusCode)
	}

	defer resp.Body.Close()

	var data map[string]interface{}

	responseData, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return models.Currency{}, err
	}

	err = json.Unmarshal(responseData, &data)

	if err != nil {
		return models.Currency{}, err
	}

	var theCurrency models.Currency

	theCurrency.Name = currency
	timestamp, err := strconv.ParseInt(data["timestamp"].(string), 10, 64)

	if err != nil {
		return models.Currency{}, err
	}

	theCurrency.Timestamp = time.Unix(timestamp, 0)
	theCurrency.BallastToDollar = data["rates"].(map[string]float64)[currency]

	return theCurrency, nil
}
