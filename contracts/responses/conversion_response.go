package responses

func NewConversionsResponse(value float64, code string) ConversionResponse {
	return ConversionResponse{
		Value:    value,
		Currency: code,
	}
}

type ConversionResponse struct {
	Value    float64 `json:"value"`
	Currency string  `json:"currency"`
}
