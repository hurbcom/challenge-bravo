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

/*
ToString returns an ISO 4217-like code representing currency c.
*/
func (c currency) ToString() string {
	s := []string{"USD", "BRL", "EUR", "BTC", "ETH"}
	return s[c]
}

/*
Quote returns the quote q of currency c in USD.

In case of internal failure, Quote returns ok = false.
*/
func Quote(c currency) (q float64, ok bool) {
	m, ok := quotesSource()
	if !ok {
		return
	}
	q = m[c]
	return
}
