package monetary

import "unicode"

// Currency represents a money currency.
// It can be of 3 types: FIAT, CRYPTO AND FICTITIOUS.
// It holds a few information necessary to make money arithmetics.
//
// FICTITIOUS currencies will always be attached to USD.
// The reason is because their value can not be measured.
// To convert a FICTITIOUS currency value to any other currency,
// it will first be converted to it's value in USD,
// and then converted to the wanted value.
//
// For example: imagine a currency named HUB.
// And say it's FixedExchangeRateIntPart would be 12 and the FixedExchangeDecimalIntPart would be 34.
// Is this case, 1 USD would buy 12,34 HUB.
//
// Currency codes will always have 3 letters only, even FICTITOUS ones.
//
//easyjson:json
type Currency struct {
	// Code is an unique currency code. The code must consist of three alphabetical (A-Z) characters only.
	Code string `json:"code" db:"code"`

	// MaxUnits is the maximum amount of decimal places this currency can have.
	MaxUnits int `json:"max_units" db:"max_units"`

	// ThousandsSplitter is the separator used to separate the thousands values.
	// Usually a comma or a dot.
	ThousandsSplitter string `json:"thousands_splitter" db:"thousands_splitter"`

	// DecimalSplitter is the separator used to separate the decimal part from the integer part.
	// Usually a comma or a dot.
	DecimalSplitter string `json:"decimal_splitter" db:"decimal_splitter"`

	// FixedExchangeRateIntPart will only be present in FICTITIOUS currencies.
	// It is used to convert a FICTITIOUS currency into a FIAT or a CRYPTO currency.
	FixedExchangeRateIntPart *int64 `json:"fixed_exchange_rate_int_part" db:"fixed_exchange_rate_int_part"`

	// FixedExchangeRateDecimalPart will only be present in FICTITIOUS currencies.
	// It is used to convert a FICTITIOUS currency into a FIAT or a CRYPTO currency.
	FixedExchangeRateDecimalPart *int64 `json:"fixed_exchange_rate_decimal_part" db:"fixed_exchange_rate_decimal_part"`

	// Standard represents the standard type of this currency.
	Standard currencyStandard `json:"standard" db:"standard"`
}

// currencyStandard represents an available currency standard type
type currencyStandard string

// Available currency standards
const (
	CurrencyStandardFIAT       currencyStandard = "FIAT"
	CurrencyStandardCrypto     currencyStandard = "CRYPTO"
	CurrencyStandardFictitious currencyStandard = "FICTITIOUS"
)

// IsCurrencyValid reports whether the passed currency is valid or not.
//
// Rules:
//
// The code must consist of three alphabetical (A-Z) characters only.
//
// MaxUnits can not be smaller than 0 nor greater than 19.
//
// ThousandsSplitter and DecimalSplliter must not be empty.
//
// If this currency standard is FICTITIOUS it must have both a
// FixedExchangeRateIntPart and a FixedExchangeRateDecimalPart.
//
// Only three standards are valid: FIAT, CRYPTO, FICTITIOUS.
func IsCurrencyValid(cur Currency) bool {
	if !IsCodeValid(cur.Code) {
		return false
	}

	if cur.MaxUnits > 19 || cur.MaxUnits < 0 {
		return false
	}

	if cur.ThousandsSplitter == "" || cur.DecimalSplitter == "" {
		return false
	}

	switch cur.Standard {
	case CurrencyStandardFictitious:
		if cur.FixedExchangeRateIntPart == nil || cur.FixedExchangeRateDecimalPart == nil {
			return false
		}
	case CurrencyStandardFIAT, CurrencyStandardCrypto:
		// valid
	default:
		return false
	}

	return true
}

// IsCodeValid reports whether the passed code is a valid
// currency code.
//
// In order to be valid, the code must consist of 3
// aplhabetical (A-Z) characters only.
func IsCodeValid(code string) bool {
	if len(code) != 3 {
		return false
	}

	for _, r := range code {
		if !unicode.IsLetter(r) {
			return false
		}
	}

	return true
}
