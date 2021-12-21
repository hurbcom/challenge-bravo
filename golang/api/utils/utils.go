package utils

import (
	"api/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/leekchan/accounting"
	"github.com/shopspring/decimal"
)

// Get data from external API
func sendExternalApiRequest(method string, url string) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		fmt.Print(err.Error())
		return nil, err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Print(err.Error())
		return nil, err
	}

	if resp.Body != nil {
		defer resp.Body.Close()
	}

	return ioutil.ReadAll(resp.Body)
}

// Get real exchange rate in external API
func GetRealRate(method string, url string) (models.ExternalApiRates, error) {
	externalApiRates := models.ExternalApiRates{}
	resultRequest, err := sendExternalApiRequest(method, url)
	if err != nil {
		return externalApiRates, err
	}

	jsonErr := json.Unmarshal(resultRequest, &externalApiRates)
	if jsonErr != nil {
		fmt.Print(jsonErr.Error())
		return externalApiRates, jsonErr
	}

	return externalApiRates, nil
}

func ConvertAmountToDecimal(amount string, exchangeRate *models.ExchangeRate) error {
	amountconv, err := decimal.NewFromString(amount)
	ac := accounting.Accounting{
		Symbol:         "",
		Precision:      2,
		Thousand:       ".",
		Decimal:        ",",
		Format:         "",
		FormatNegative: "",
		FormatZero:     "",
	}

	if err == nil {
		percentage := decimal.NewFromInt(100)
		exchangeRate.Amount = ac.FormatMoney(amountconv.Mul(exchangeRate.Rate).Mul(percentage).Div(percentage))
	}

	return err
}
