package currency

import (
	"fmt"
)

type ErrCurrencyUnsupported struct {
	Currency string
}

func (err *ErrCurrencyUnsupported) Error() string {
	return fmt.Sprintf("unsupported [%s] currency", err.Currency)
}

type CurrencyQuotationResult map[string]float64

func (cqr CurrencyQuotationResult) GetCurrency(currency string) (float64, error) {
	value, ok := cqr[currency]
	if !ok {
		return 0, &ErrCurrencyUnsupported{currency}
	}

	return value, nil
}
