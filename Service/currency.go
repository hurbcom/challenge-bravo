package service

import (
	responsemodel "challenge-bravo/Models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

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
func GetValue(from string, to string, amount string) float64 {
	output, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	}

	valueTo := gjson.Get(string(output), "rates."+strings.ToUpper(to))
	valueFrom := gjson.Get(string(output), "rates."+strings.ToUpper(from))

	doubleTo, _ := strconv.ParseFloat(string(valueTo.Raw), 64)
	doubleFrom, _ := strconv.ParseFloat(string(valueFrom.Raw), 64)
	doubleAmount, _ := strconv.ParseFloat(amount, 64)

	final := (doubleTo / doubleFrom) * doubleAmount

	return final
}

// ValidPost get the keys of post and build the string of payload
func ValidPost(r *http.Request) (string, string, string, string) {

	keys := r.URL.Query()

	from := keys["from"]
	to := keys["to"]
	amount := keys["amount"]

	if len(from) <= 0 {
		return "", "", "", "from"
	}

	if to == nil {
		return "", "", "", "to"
	}

	if amount == nil {
		return "", "", "", "amount"
	}

	return strings.Join(from, ""), strings.Join(to, ""), strings.Join(amount, ""), ""
}
