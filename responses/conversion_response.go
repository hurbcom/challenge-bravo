package responses

type ConversionResponse struct {
	Value    float64 `json:"value"`
	Currency string  `json:"currency"`
}
