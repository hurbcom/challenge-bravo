package requests

type CreateCurrencyRequest struct {
	Code                string  `json:"code"`
	BackingCurrencyCode string  `json:"backingCurrencyCode"`
	Value               float64 `json:"value"`
}
