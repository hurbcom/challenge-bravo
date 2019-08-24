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

/*
Currencies returns an array containing all supported currencies.
*/
func Currencies() []currency {
	return []currency{USD, BRL, EUR, BTC, ETH}
}
