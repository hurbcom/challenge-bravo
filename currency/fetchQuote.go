package currency

import (
	"encoding/json"
	"net/http"
)

const (
	url = "https://min-api.cryptocompare.com"
)

type fetchResult struct {
	Quote float64 `json:"USD"`
}

func fetchQuote(c currency) (q float64, ok bool) {
	endpoint := "/data/price?&tsyms=USD&fsym=" + c.ToString()
	r, err := http.Get(url + endpoint)
	if err != nil {
		ok = false
		return
	}
	if r.StatusCode != http.StatusOK {
		ok = false
		return
	}
	var j fetchResult
	json.NewDecoder(r.Body).Decode(&j)
	q = j.Quote
	ok = true
	return
}
