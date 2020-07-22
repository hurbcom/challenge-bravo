package currency

import (
	"testing"
)

func TestConvertCoinFromUnsupportedCurrency(t *testing.T) {
	fromCurrencyName := "ABC"

	cryptoService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{}, nil
	})

	paperService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{USD: 100}, nil
	})

	_, err := NewService("", cryptoService, paperService).ConvertCurrency(fromCurrencyName, "", 0)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCurrencyUnsupported); !ok {
		t.Error("unexpected value error not equals *ErrCoinUnsupported")
		return
	}
}

func TestConvertCoinToUnsupportedCurrency(t *testing.T) {
	fromCurrencyName := ETH
	toCurrencyName := "ABC"

	cryptoService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{ETH: 0.108}, nil
	})

	paperService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{}, nil
	})

	_, err := NewService("", cryptoService, paperService).ConvertCurrency(fromCurrencyName, toCurrencyName, 0)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCurrencyUnsupported); !ok {
		t.Error("unexpected value error not equals *ErrCoinUnsupported")
		return
	}
}

func TestConvertCoinSuccessful(t *testing.T) {
	fromCurrencyName := BRL
	var fromCurrencyAmount int64 = 2
	toCurrencyName := USD
	var toCurrencyValue float64 = 400

	cryptoService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{}, nil
	})

	paperService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{fromCurrencyName: 1, toCurrencyName: 200}, nil
	})

	convertedCurrency, err := NewService("", cryptoService, paperService).ConvertCurrency(fromCurrencyName, toCurrencyName, fromCurrencyAmount)
	if err != nil {
		t.Error(err)
		return
	}

	if got, want := convertedCurrency.Name, toCurrencyName; got != want {
		t.Errorf("unexpected converted coin name: got: %v, want: %v", got, want)
		return
	}

	if got, want := convertedCurrency.Value, toCurrencyValue; got != want {
		t.Errorf("unexpected converted coin value: got: %v, want: %v", got, want)
		return
	}
}
