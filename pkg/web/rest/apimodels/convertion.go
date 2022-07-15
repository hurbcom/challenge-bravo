package apimodels

import "encoding/json"

// Convertion is the API response for a convert request
type Convertion struct {
	From   string      `json:"from"`
	To     string      `json:"to"`
	Amount json.Number `json:"amount"`
	Result json.Number `json:"result"`
} //@name Convertion
