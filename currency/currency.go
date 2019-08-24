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
ToCurrency converts an ISO 4217-like code s to a currency.

If s represents a supported currency, ToCurrency returns its correspondent
currency unit c.

If s does not represent a supported currency, ToCurrency returns ok = false.
*/
func ToCurrency(s string) (c currency, ok bool) {
	m := make(map[string]currency)
	m["USD"] = USD
	m["BRL"] = BRL
	m["EUR"] = EUR
	m["BTC"] = BTC
	m["ETH"] = ETH
	c, ok = m[s]
	return
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

/*
Convert converts amount based on the conversion quote between from and to,
returning convertedAmount.

In case of internal failure, Convert returns ok = false.
*/
func Convert(from currency, to currency, amount float64) (convertedAmount float64, ok bool) {
	quoteFrom, ok := Quote(from)
	if !ok {
		return
	}
	quoteTo, ok := Quote(to)
	if !ok {
		return
	}
	quote := quoteFrom / quoteTo
	convertedAmount = amount * quote
	return
}
