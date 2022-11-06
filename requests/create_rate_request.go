package requests

type CreateRateRequest struct {
	CurrencyCode        string  `json:"currencyCode"`
	BackingCurrencyCode string  `json:"backingCurrencyCode"`
	Value               float64 `json:"value"`
}
