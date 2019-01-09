package converter_test

import (
	"challenge-bravo/cache"
	"challenge-bravo/converter"
	"challenge-bravo/rates"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Test GetCurrencyLabel passing supported Symbol - should return label of currency
func TestGetCurrencyLabel(t *testing.T) {
	label := converter.GetCurrencyLabel("BTC")
	assert.NotEmpty(t, label, "Should return an string")
}

// Test GetCurrencyLabel passing unsupported Symbol - should return an empty string
func TestGetCurrencyLabelWithUnsupportedSymbol(t *testing.T) {
	label := converter.GetCurrencyLabel("ABC")
	assert.Equal(t, "", label, "Should return empty string")
}

// Test Currency Converter passing correct values - should return an float64 to first var, and second one must be nil
func TestCurrencyConverter(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	// To: crypto currencies
	value, err := converter.CurrencyConverter(375, "USD", "ETH")
	assert.NotNil(t, value, "Should not return nil value")
	assert.NoError(t, err, "Should not return error")

	// To: other currencies
	value, err = converter.CurrencyConverter(2, "BTC", "USD")
	assert.NotNil(t, value, "Should not return nil value")
	assert.NoError(t, err, "Should not return error")
}

// Test Currency Converter with empty cache - should return nil to first var, and error to second var
func TestCurrencyConverterWithEmptyCache(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()

	value, err := converter.CurrencyConverter(5, "ETH", "BRL")
	assert.Nil(t, value, "Should return nil value")
	assert.Error(t, err, "Should return error")
}
