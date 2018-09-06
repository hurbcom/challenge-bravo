package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvert(t *testing.T) {
	const tolerance = 1e-8
	p := NewPrice(Quotes{
		"USD": 1,
		"BRL": 4.05,
		"EUR": 0.86,
		"BTC": 0.00014,
		"ETH": 0.0034,
		"IOT": 0,
	})
	assert.InDelta(t, .0, p.Convert("EUR", "ETH", 0), tolerance)
	assert.InDelta(t, 24.285714286, p.Convert("BTC", "ETH", 1), tolerance)
	assert.InDelta(t, 0.35, p.Convert("ETH", "BTC", 8.5), tolerance)
	assert.InDelta(t, 77.3145, p.Convert("USD", "BRL", 19.09), tolerance)
	assert.InDelta(t, 19.73, p.Convert("USD", "USD", 19.73), tolerance)
	assert.InDelta(t, .0, p.Convert("IOT", "BRL", 6.66), tolerance)
	assert.InDelta(t, .0, p.Convert("EUR", "IOT", 123.19), tolerance)
}
