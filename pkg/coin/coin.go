package coin

type Coin struct {
	Name   string
	Amount int64
}

type RepositoryData struct {
	Rates map[string]float64 `json:"rates"`
	Base  string             `json:"base"`
	Date  string             `json:"date"`
}
