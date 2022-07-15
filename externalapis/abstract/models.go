package abstract

// LiveResponse represents the response returned by the EndpointLive
type LiveResponse struct {
	Base          string             `json:"base"`
	LastUpdated   int                `json:"last_updated"`
	ExchangeRates map[string]float64 `json:"exchange_rates"`
}
