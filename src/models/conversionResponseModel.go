package models

type ConversionResponse struct {
	FromCurrency   string  `json:"fromCurrency"`
	ToCurrency     string  `json:"toCurrency"`
	Amount         float64 `json:"amount"`
	ConvertedValue float64 `json:"convertedValue"`
}
