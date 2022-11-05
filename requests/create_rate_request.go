package requests

type CreateRateRequest struct {
	CurrencyCode        string
	BackingCurrencyCode string
	Value               float64
}
