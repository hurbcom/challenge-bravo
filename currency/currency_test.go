package currency

import (
	"testing"
)

func TestCurrencies(t *testing.T) {
	currencies := Currencies()
	if len(currencies) != 5 {
		t.Error("mismatched number of currencies")
	}
	m := make(map[currency]bool)
	for _, c := range currencies {
		switch c {
		case USD, BRL, EUR, BTC, ETH:
			m[c] = true
		default:
			t.Error("unsupported currency")
		}
	}
	if len(m) != 5 {
		t.Error("supported currencies are missing")
	}
}

func TestToString(t *testing.T) {
	if USD.ToString() != "USD" {
		t.Error("bad string conversion: USD")
	}
	if BRL.ToString() != "BRL" {
		t.Error("bad string conversion: BRL")
	}
	if EUR.ToString() != "EUR" {
		t.Error("bad string conversion: EUR")
	}
	if BTC.ToString() != "BTC" {
		t.Error("bad string conversion: BTC")
	}
	if ETH.ToString() != "ETH" {
		t.Error("bad string conversion: ETH")
	}
}

func TestQuote(t *testing.T) {
	for _, c := range Currencies() {
		quotesSource = failingQuotesSource
		if _, ok := Quote(c); ok {
			t.Error("unable to signal failed quotes sourcing")
		}
		quotesSource = fakeQuotesSource
		q, ok := Quote(c)
		if !ok {
			t.Error("failure reading an offline quotes source #1")
		}
		fqs, ok := fakeQuotesSource()
		if !ok {
			t.Error("failure reading an offline quotes source #2")
		}
		if q != fqs[c] {
			t.Errorf("wrong quote for %s", c.ToString())
		}
	}
}
