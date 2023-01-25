package models

type ResponseCurrency struct {
	FromCurrency    string  `json:"from"`
	ToCurrency      string  `json:"to"`
	Amount          float64 `json:"amount"`
	AmountConverted float64 `json:"amountConverted"`
}
