package currency

const (
	USD = "USD"
	BRL = "BRL"
	EUR = "EUR"
	BTC = "BTC"
	ETH = "ETH"
)

type Currency struct {
	Name  string
	Value float64
}
