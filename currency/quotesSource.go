package currency

func failingQuotesSource(c currency) (_ float64, ok bool) {
	ok = false
	return
}

func fakeQuotesSource(c currency) (q float64, ok bool) {
	m := make(map[currency]float64)
	m[USD] = 1.0
	m[BRL] = 0.25
	m[EUR] = 1.1
	m[BTC] = 10000.0
	m[ETH] = 200.0
	q, ok = m[c]
	return
}

func cachedQuotesSource(c currency) (q float64, ok bool) {
	return quotesCache.Quote(c)
}

var quotesSource func(currency) (float64, bool) = fakeQuotesSource
