package models

//Coin basic coin only with the synbil
type Coin struct {
	Symbol string `json:"symbol"`
}

//CoinExchange coin to be converted
type CoinExchange struct {
	From           string  `json:"from"`
	To             string  `json:"to"`
	Amount         float64 `json:"amount"`
	AmountConveted float64 `json:"AmountConveted"`
}
