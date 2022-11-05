package responses

func NewConversionsResponse(value float64, currencyCode string) ConversionResponse {
	return ConversionResponse{
		Value:    value,
		Currency: currencyCode,
	}
}

type ConversionResponse struct {
	Value    float64 `json:"value"`
	Currency string  `json:"rate"`
}
