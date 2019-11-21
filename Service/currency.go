package service

import (
	responsemodel "challenge-bravo/Models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/shopspring/decimal"
	"github.com/tidwall/gjson"
)

const point = "https://api.exchangerate-api.com/v4/latest/usd"

var msg responsemodel.ResponseModel

// SetCurrency get the actual currency
func SetCurrency() {
	for {
		req, err := http.NewRequest("POST", point, nil)
		res, err := http.DefaultClient.Do(req)

		if err != nil {
			panic(err)
		}
		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			panic(err)
		}

		// Unmarshal
		err = json.Unmarshal(b, &msg)
		if err != nil {
			panic(err)
		}
		time.Sleep(time.Second * 30)
	}
}

// GetValue return the value converted
func GetValue(from string, to string, dAmount decimal.Decimal) decimal.Decimal {
	output, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	}
	var final decimal.Decimal

	if msg.TimeLastUpdated > 0 {
		valueTo := gjson.Get(string(output), "rates."+strings.ToUpper(to))
		valueFrom := gjson.Get(string(output), "rates."+strings.ToUpper(from))

		dTo, _ := decimal.NewFromString(string(valueTo.Raw))
		dFrom, _ := decimal.NewFromString(string(valueFrom.Raw))
		final = dTo.Div(dFrom).Mul(dAmount)
	}

	return final
}

// ValidPost get the keys of post and build the string of payload
func ValidPost(r *http.Request) (string, string, decimal.Decimal, string) {

	keys := r.URL.Query()

	from := strings.Join(keys["from"], "")
	to := strings.Join(keys["to"], "")
	amount := strings.Join(keys["amount"], "")

	if err := responsemodel.ReflectStructField(msg.Rates, strings.ToUpper(from)); err != nil {
		return "", "", decimal.New(0, 1), "Unable to convert from this currency '" + strings.ToUpper(from) + "'"
	}
	if err := responsemodel.ReflectStructField(msg.Rates, strings.ToUpper(to)); err != nil {
		return "", "", decimal.New(0, 1), "Unable to convert to this currency '" + strings.ToUpper(to) + "'"
	}

	if len(from) <= 0 {
		return "", "", decimal.New(0, 1), "Please, fill the FROM field"
	}

	if len(to) <= 0 {
		return "", "", decimal.New(0, 1), "Please, fill the TO field"
	}

	if len(amount) <= 0 {
		return "", "", decimal.New(0, 1), "Please, fill the AMOUNT field"
	}

	dAmount, err := decimal.NewFromString(amount)

	if err != nil || dAmount.IsNegative() {
		return "", "", decimal.New(0, 1), "Invalid value, send positive value greater than zero"
	}

	return from, to, dAmount, ""
}
