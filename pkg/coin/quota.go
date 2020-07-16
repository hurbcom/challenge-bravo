package coin

import (
	"fmt"
)

type ErrCoinUnsupported struct {
	Coin string
}

func (err *ErrCoinUnsupported) Error() string {
	return fmt.Sprintf("unsupported [%s] coin", err.Coin)
}

type CurrencyQuotationResult map[string]float64

func (cqr CurrencyQuotationResult) GetCurrency(currency string) (float64, error) {
	value, ok := cqr[currency]
	if !ok {
		return 0, &ErrCoinUnsupported{currency}
	}

	return value, nil
}
