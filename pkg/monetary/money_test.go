package monetary

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

const threshold = 1e-9

func TestMoney(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		money          *Money
		expectedCur    Currency
		expectedFloat  float64
		expectedStr    string
		expectedDotStr string
		testCur        bool
		splitThousands bool
	}{
		{nil, Currency{}, 0, "", "", true, false},
		{&Money{10, 10, Currency{}}, Currency{}, 10.10, "", "", true, false},
		{&Money{0, 1, Currency{}}, Currency{}, 0.1, "", "", false, false},
		{&Money{-10000, 10, Currency{MaxUnits: 8, ThousandsSplitter: ".", DecimalSplitter: ","}}, Currency{}, -10000.10, "-10.000,00000010", "", false, true},
		{&Money{-10000, 10, Currency{MaxUnits: 8, ThousandsSplitter: ".", DecimalSplitter: ","}}, Currency{}, -10000.10, "-10000,00000010", "", false, false},
		{&Money{-10000, 10, Currency{MaxUnits: 8, ThousandsSplitter: ".", DecimalSplitter: ","}}, Currency{}, -10000.10, "", "-10000.00000010", false, false},
	} {
		if tc.testCur {
			assert.Equal(tc.money.Currency(), tc.expectedCur, fmt.Sprintf("error at index %d", index))
		}

		if tc.expectedFloat != 0 {
			assert.InDelta(tc.expectedFloat, tc.money.GetFloat(), threshold, fmt.Sprintf("error at index %d", index))
		}

		if tc.expectedStr != "" {
			assert.Equal(tc.expectedStr, tc.money.StringAmount(tc.splitThousands), fmt.Sprintf("error at index %d", index))
		}

		if tc.expectedDotStr != "" {
			assert.Equal(tc.expectedDotStr, tc.money.StringAmountDotDecimal(tc.splitThousands), fmt.Sprintf("error at index %d", index))
		}
	}
}

func TestNew(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		iPart, dPart any
		shouldError  bool
	}{
		{int64(0), int64(0), false},
		{"10", "10", false},
		{"", "", true},
		{"10", "abc", true},
	} {
		switch t := tc.iPart.(type) {
		case string:
			_, err := NewFromString(t, tc.dPart.(string), Currency{})
			if tc.shouldError {
				assert.Error(err, fmt.Sprintf("error at index %d", index))
				continue
			}

			assert.NoError(err, fmt.Sprintf("error at index %d", index))
		default:
			m := New(t.(int64), tc.dPart.(int64), Currency{})
			assert.NotNil(m, fmt.Sprintf("error at index %d", index))
		}
	}
}
