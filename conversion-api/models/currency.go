package models

//Currency it's the base struct for a unique currency, it holds the currency name and ballast to dollar
type Currency struct {
	ID              int64   `json:"id"`
	Name            string  `json:"name"`
	BallastToDollar float64 `json:"ballast_to_dollar"`
}

//CurrencyExchange holds the info to return the exchange of a currency to another
type CurrencyExchange struct {
	CurrencyFrom   Currency `json:"currency_from"`
	CurrencyTo     Currency `json:"currency_to"`
	OriginalValue  float64  `json:"original_value"`
	ExchangedValue float64  `json:"exchange_value"`
}
