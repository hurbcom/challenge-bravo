package currency

type quotes map[currency]float64

func fakeQuotesSource() (quotes, bool) {
	m := make(quotes)
	m[USD] = 1.0
	m[BRL] = 0.25
	m[EUR] = 1.1
	m[BTC] = 10000.0
	m[ETH] = 200.0
	return m, true
}

var quotesSource func() (quotes, bool) = fakeQuotesSource
