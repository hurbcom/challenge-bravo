package monetary

import (
	"strconv"
	"strings"
)

// New creates a new Money using the passed information.
// New does not validate the currency. That is up to the caller.
func New(intPart int64, decimalPart int64, cur Currency) *Money {
	return &Money{
		iPart: intPart,
		dPart: decimalPart,
		cur:   cur,
	}
}

// NewFromString creates a new Money using the passed information.
// NewFromString will fail if the passed currency or the string
// parts are not valid.
// NewFromString does not validate the currency. That is up to the caller.
func NewFromString(strIntPart, strDecimalPart string, cur Currency) (*Money, error) {
	intPart, err := strconv.ParseInt(strIntPart, 10, 64)
	if err != nil {
		return nil, err
	}

	decimalPart, err := strconv.ParseInt(strDecimalPart, 10, 64)
	if err != nil {
		return nil, err
	}

	return &Money{
		iPart: intPart,
		dPart: decimalPart,
		cur:   cur,
	}, nil
}

// Money represents a monetary value.
// It stores the amount and the currency data.
type Money struct {
	iPart int64
	dPart int64
	cur   Currency
}

// GetFloat returns the amount as a float64
func (m *Money) GetFloat() float64 {
	str := strconv.FormatInt(m.iPart, 10) + "." + strconv.FormatInt(m.dPart, 10)
	f, _ := strconv.ParseFloat(str, 64)
	return f
}

// Currency returns the money's currency.
func (m *Money) Currency() Currency {
	if m == nil {
		return Currency{}
	}

	return m.cur
}

func (m *Money) rawStringAmount() string {
	strDecimalPart := strconv.FormatInt(int64(m.dPart), 10)

	if len(strDecimalPart) < m.cur.MaxUnits {
		// append zeros to get the correct decimal value
		strDecimalPart = strings.Repeat("0", m.cur.MaxUnits-len(strDecimalPart)) + strDecimalPart
	}

	intPart := m.iPart
	if m.iPart < 0 {
		// raw string must be unsigned
		intPart *= -1
	}

	return strconv.FormatInt(intPart, 10) + strDecimalPart
}

// StringAmount parses the money amount to a string.
//
// splitThousands defines wether your want the string to be divided
// by the m.currency.ThousandsSplitter.
func (m *Money) StringAmount(splitThousands bool) string {
	return m.stringAmount(splitThousands, false)
}

// StringAmountDotDecimal parses the money amount to a string, forcing the
// decimal splitter to be a dot.
//
// splitThousands defines wether your want the string to be divided
// by the m.currency.ThousandsSplitter.
func (m *Money) StringAmountDotDecimal(splitThousands bool) string {
	return m.stringAmount(splitThousands, true)
}

func (m *Money) stringAmount(splitThousands, useGlobal bool) string {
	strAmount := m.rawStringAmount()

	decimalSplitter := m.cur.DecimalSplitter
	if useGlobal {
		decimalSplitter = "."
	}

	if splitThousands {
		// for every 3 digits in the amount that is not a decimal,
		// we add the thousand splitter.
		// On every iteration we reduce i by 3. Since we are checking if
		// i > 0, this means that if the value is 12345, for example, after adding a dot
		// between 2 and 3, the loop will break, thus not adding an unnecessary splitter
		// before the 1.
		for i := len(strAmount) - m.cur.MaxUnits - 3; i > 0; i -= 3 {
			strAmount = strAmount[:i] + m.cur.ThousandsSplitter + strAmount[i:]
		}
	}

	if m.cur.MaxUnits > 0 {
		// This currency has decimals, so we need to add the decimal splitter.
		// We slice the string based on the amount of decimal units and add the splitter in the middle.
		strAmount = strAmount[:len(strAmount)-m.cur.MaxUnits] + decimalSplitter + strAmount[len(strAmount)-m.cur.MaxUnits:]
	}

	if m.iPart < 0 {
		// The amount is a negative value, so add the negative sign.
		strAmount = "-" + strAmount
	}

	return strAmount
}
