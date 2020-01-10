package models

import (
	"encoding/json"
	"log"
)

type (
	//Currency is the model to a single currency
	Currency struct {
		ID    int64   `json:"id"`
		Name  string  `json:"name"`
		Code  string  `json:"code"`
		Value float64 `json:"value"`
	}

	//Currencies is a slice of Currency
	Currencies struct {
		Currencies []Currency `json:"currencies"`
	}
)

//ToJSON convets the user struct to JSON
func (currencies *Currencies) ToJSON() string {
	json, err := json.Marshal(currencies)
	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return string(json)
}
