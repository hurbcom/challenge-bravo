package apierror

type code int

// User errors
const (
	ErrCodeMissingRequiredField code = iota + 1
	ErrCodeCurrencyNotFound
	ErrCodeInvalidCurrency
	ErrCodeInvalidAmount
	ErrCodeErrInvalidCurrencyBody
	ErrCodeNotFound
)

// Internal server errors
const (
	ErrCodeFailedToMarshalResponse code = iota + 1000
	ErrCodeDatabaseFailed
	ErrCodeMonetaryFailed
	ErrCodeConvertionFailed
	ErrCodeMarshalingFailed
)
