package entities

type ExchangeResult struct {
	Motd    map[string]string
	Success bool
	Base    string
	date    string
	Rates   map[string]float32
}
