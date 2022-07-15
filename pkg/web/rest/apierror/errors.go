package apierror

var (
	// ErrMissingRequiredField will be sent in case
	// a required field was not sent in the request.
	ErrMissingRequiredField = E{
		Message: "required field missing",
		Code:    ErrCodeMissingRequiredField,
	}

	// ErrCurrencyNotFound will be sent when the
	// requested currency was not found in the DB.
	ErrCurrencyNotFound = E{
		Code:    ErrCodeCurrencyNotFound,
		Message: "currency not found; this doesn't necessarily mean this currency doesn't exist, it might mean that this currency is not yet registered",
		RawErr:  "currency not found",
	}

	// ErrInvalidCurrency will be sent when the
	// request passed an invalid currency code.
	ErrInvalidCurrency = E{
		Code:    ErrCodeInvalidCurrency,
		Message: "only 3 letters currency code allowed",
	}

	// ErrInvalidCurrencyBody will be sent when
	// the request passed an invalid currency body.
	ErrInvalidCurrencyBody = E{
		Code:    ErrCodeErrInvalidCurrencyBody,
		Message: "the passed body is not a valid currency",
		RawErr:  "the passed currency is not valid; make sure it follows the standards",
	}

	// ErrInvalidAmount will be sent in case
	// the requested amount for a convertion is not valid.
	ErrInvalidAmount = E{
		Code:    ErrCodeInvalidAmount,
		Message: "The amount passed is not valid",
	}

	// ErrNotFound will be sent when
	// the endpoint was not found.
	ErrNotFound = E{
		Code:    ErrCodeNotFound,
		Message: "404 page not found",
		RawErr:  "404 page not found",
	}

	// ErrDatabaseFailed will be sent in
	// case of a database failure.
	ErrDatabaseFailed = E{
		Message: "database action failed",
		Code:    ErrCodeDatabaseFailed,
	}

	// ErrMonetaryFailed will be sent in case
	// the monetary package returned an error.
	ErrMonetaryFailed = E{
		Message: "unable to create the montary value",
		Code:    ErrCodeMonetaryFailed,
	}

	// ErrConvertionFailed will be sent in case a
	// convertion did not succeed.
	ErrConvertionFailed = E{
		Message: "unable to convert the currency",
		Code:    ErrCodeConvertionFailed,
	}

	// ErrMarshalingFailed will be sent in case
	// the json failed to be marshaled.
	ErrMarshalingFailed = E{
		Message: "unable to create the response",
		Code:    ErrCodeMarshalingFailed,
	}
)
