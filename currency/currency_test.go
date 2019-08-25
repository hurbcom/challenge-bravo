package currency

import (
	"math"
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

func TestToCurrency(t *testing.T) {
	if _, ok := ToCurrency(""); ok {
		t.Error("string conversion to currency does not detect errors")
	}
	for _, c := range Currencies() {
		cFromString, ok := ToCurrency(c.ToString())
		if !ok {
			t.Error("cannot find supported currency from code")
		}
		if cFromString != c {
			t.Error("conversion does not match ISO 4217-like code")
		}
	}
}

func TestQuote(t *testing.T) {
	for _, c := range Currencies() {
		quotesSource = failingQuotesSource
		if _, ok := Quote(c); ok {
			t.Error("unable to signal failed quotes sourcing")
		}
		quotesSource = fakeQuotesSource
		quote, ok := Quote(c)
		if !ok {
			t.Error("failure reading an offline quotes source #1")
		}
		fakeQuote, ok := fakeQuotesSource(c)
		if !ok {
			t.Error("failure reading an offline quotes source #2")
		}
		if quote != fakeQuote {
			t.Errorf("wrong quote for %s", c.ToString())
		}
	}
}

func TestConvert(t *testing.T) {
	quotesSource = fakeQuotesSource
	for _, c1 := range Currencies() {
		for _, c2 := range Currencies() {
			q1, ok := Quote(c1)
			if !ok {
				t.Error("quote error #1")
			}
			q2, ok := Quote(c2)
			if !ok {
				t.Error("quote error #2")
			}
			a, ok := Convert(c1, c2, 1.0)
			if !ok {
				t.Error("conversion call failed")
			}
			delta := math.Abs(a - q1/q2)
			if delta > 0.1 {
				t.Error("conversion value mismatch")
			}
		}
	}
}
