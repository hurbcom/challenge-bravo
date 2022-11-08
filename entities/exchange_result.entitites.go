package entities

type ExchangeResult struct {
	Motd    map[string]string
	Success bool
	Base    string
	Date    string
	Rates   map[string]float32
}
