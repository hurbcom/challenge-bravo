package models

type CoinExchange struct {
	From           string  `json:"from"`
	To             string  `json:"to"`
	Amount         float64 `json:"amount"`
	ExchangeAmount float64 `json:"exchange_amount"`
}
