package requests

type CreateCurrencyRequest struct {
	Code  string  `json:"code"`
	Value float64 `json:"value"`
}
