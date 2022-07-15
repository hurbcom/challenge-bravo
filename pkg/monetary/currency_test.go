package monetary

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsCurrencyValid(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		cur   Currency
		valid bool
	}{
		{Currency{Code: "a"}, false},
		{Currency{Code: "ab3"}, false},
		{Currency{Code: "ABC", MaxUnits: -1}, false},
		{Currency{Code: "ABC", MaxUnits: 20}, false},
		{Currency{Code: "ABC", ThousandsSplitter: "."}, false},
		{Currency{Code: "ABC", DecimalSplitter: "."}, false},
		{Currency{Code: "ABC", ThousandsSplitter: ".", DecimalSplitter: ",", Standard: CurrencyStandardFictitious}, false},
		{Currency{Code: "ABC", ThousandsSplitter: ".", DecimalSplitter: ",", Standard: CurrencyStandardCrypto}, true},
		{Currency{Code: "ABC", ThousandsSplitter: ".", DecimalSplitter: ",", Standard: "INVALID"}, false},
	} {
		assert.Equal(tc.valid, IsCurrencyValid(tc.cur), fmt.Sprintf("error at index %d", index))
	}
}
