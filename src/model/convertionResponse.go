package model

import "time"

//ConvertionResponse ... variável de resposta da api
type ConvertionResponse struct {
	LastUpdate time.Time `json:"last_update"`
	From       string    `json:"from"`
	To         string    `json:"to"`
	Amount     float64   `json:"amount"`
	Value      float64   `json:"value"`
}
