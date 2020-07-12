package coin

const (
	USD = "USD"
	BRL = "BRL"
	EUR = "EUR"
	BTC = "BTC"
	ETH = "ETH"
)

type Coin struct {
	Name  string
	Value int64
}
