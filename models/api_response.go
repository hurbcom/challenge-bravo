package models

import (
	"encoding/json"
	"log"
)

type (
	//APIResponse is used for converting to struct currencies values returned from Exchange API
	APIResponse struct {
		Rates map[string]float64 `json:"rates"`
		Base  string             `json:"base"`
		Date  string             `json:"date"`
	}

	//ExchangeResponse is used for responsing the conversion route
	ExchangeResponse struct {
		From   string  `json:"from"`
		To     string  `json:"to"`
		Amount float64 `json:"amount"`
		Total  float64 `json:"total"`
	}
)

//ToJSON convets the user struct to JSON
func (response *ExchangeResponse) ToJSON() string {
	json, err := json.Marshal(response)
	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return string(json)
}
