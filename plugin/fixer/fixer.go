package fixer

import (
	"encoding/json"
	"errors"
	"net/http"
)

type Fixer struct {
	Caller Caller
}

//GetRates get the current currency rates from Fixer
func (f *Fixer) GetRates() (RatesResponse, error) {
	var rates RatesResponse

	path := "latest"
	response, err := f.Caller.CallAPI(http.MethodGet, path, nil)
	if err != nil {
		return rates, err
	}

	err = json.Unmarshal(response, &rates)
	if rates.Error.Code != 0 {
		return rates, errors.New(rates.Error.Info)
	}
	return rates, err
}
