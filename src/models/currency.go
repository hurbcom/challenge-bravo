package models

type Currency struct {
	Code string  `json:"code,omitempty"`
	Bid  float64 `json:"bid,omitempty"`
}
