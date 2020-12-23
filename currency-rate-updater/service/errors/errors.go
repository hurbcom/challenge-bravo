package errors

import "errors"

var ErrInvalidCurrency = errors.New("currency is invalid")
var ErrCurrencyNotFound = errors.New("currency not found")
var ErrCurrencyAlreadyExist = errors.New("currency already exist")
