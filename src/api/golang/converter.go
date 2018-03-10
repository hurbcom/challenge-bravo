package main

// The converter Type (more like an object)
type Converter struct {
	From		string   `json:"from,omitempty"`
	To			string   `json:"to,omitempty"`
	Rate		float64  `json:"rate,omitempty"`
	Amount		float64  `json:"amount,omitempty"`
	ConvertedAmount float64  `json:"converted_amount,omitempty"`
}