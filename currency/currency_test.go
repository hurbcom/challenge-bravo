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
