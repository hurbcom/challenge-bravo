package currency

/*
currency represents a currency unit.
*/
type currency int

const (
	USD currency = iota // US Dollar
	BRL                 // Brazilian Real
	EUR                 // Euro
	BTC                 // Bitcoin
	ETH                 // Ethereum
)
