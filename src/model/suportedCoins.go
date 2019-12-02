package model

//SuportedCoins ... variável para controlar as moedas suportadas pela API
type SuportedCoins struct {
	Suported map[string]bool `json:"suported"`
}
