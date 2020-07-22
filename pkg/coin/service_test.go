package coin

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

	_, err := NewService("", cryptoService, paperService).ConvertCoin(fromCurrencyName, "", 0)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCoinUnsupported); !ok {
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

	_, err := NewService("", cryptoService, paperService).ConvertCoin(fromCurrencyName, toCurrencyName, 0)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCoinUnsupported); !ok {
		t.Error("unexpected value error not equals *ErrCoinUnsupported")
		return
	}
}

func TestConvertCoinSuccessful(t *testing.T) {
	fromCoinName := BRL
	var fromCoinAmount int64 = 2
	toCoinName := USD
	var toCoinValue float64 = 400

	cryptoService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{}, nil
	})

	paperService := MockQueryCurrencyQuotationFunc(func(_ string) (CurrencyQuotationResult, error) {
		return CurrencyQuotationResult{fromCoinName: 1, toCoinName: 200}, nil
	})

	convertedCoin, err := NewService("", cryptoService, paperService).ConvertCoin(fromCoinName, toCoinName, fromCoinAmount)
	if err != nil {
		t.Error(err)
		return
	}

	if got, want := convertedCoin.Name, toCoinName; got != want {
		t.Errorf("unexpected converted coin name: got: %v, want: %v", got, want)
		return
	}

	if got, want := convertedCoin.Value, toCoinValue; got != want {
		t.Errorf("unexpected converted coin value: got: %v, want: %v", got, want)
		return
	}
}
