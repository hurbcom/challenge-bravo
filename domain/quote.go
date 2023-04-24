package domain

const (
	QuoteToBankCurrency QuoteType = iota
	QuoteFromBankCurrency
	QuoteNotAvailable
)

type (
	QuoteType uint8

	Quote struct {
		From   string
		To     string
		Name   string
		Amount float64
	}
)
