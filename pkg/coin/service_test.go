package coin

import (
	"errors"
	"testing"
)

func TestConvertCoinFromUnsupportedCoin(t *testing.T) {
	fromCoin := Coin{Name: "ABC", Value: 20}
	toCoin := BRL

	secondaryport := MockQueryCoinQuotaFunc(func(cname string) (CoinQuotaResult, error) {
		return CoinQuotaResult{}, errors.New("generic error")
	})

	convertedCoin, err := NewService(secondaryport).ConvertCoin(fromCoin, toCoin)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCoinUnsupported); !ok {
		t.Error("unexpected value error not equals *ErrCoinUnsupported")
		return
	}

	if convertedCoin != nil {
		t.Error("unexpected converted coin value not equals nil")
		return
	}
}

func TestConvertCoinToUnsupportedCoin(t *testing.T) {
	fromCoin := Coin{Name: BRL, Value: 20}
	toCoin := "ABC"

	secondaryport := MockQueryCoinQuotaFunc(func(cname string) (CoinQuotaResult, error) {
		return CoinQuotaResult{
			BRL: 10,
			EUR: 100,
		}, nil
	})

	convertedCoin, err := NewService(secondaryport).ConvertCoin(fromCoin, toCoin)
	if err == nil {
		t.Error("unexpected error value as nil")
		return
	}

	if _, ok := err.(*ErrCoinUnsupported); !ok {
		t.Error("unexpected value error not equals *ErrCoinUnsupported")
		return
	}

	if convertedCoin != nil {
		t.Error("unexpected converted coin value not equals nil")
		return
	}
}

func TestConvertCoinSuccessful(t *testing.T) {
	fromCoin := Coin{Name: BRL, Value: 20}
	toCoin := USD

	secondaryport := MockQueryCoinQuotaFunc(func(cname string) (CoinQuotaResult, error) {
		return CoinQuotaResult{
			toCoin: 10,
			EUR:    100,
		}, nil
	})

	convertedCoin, err := NewService(secondaryport).ConvertCoin(fromCoin, toCoin)
	if err != nil {
		t.Error(err)
		return
	}

	if got, want := convertedCoin.Name, toCoin; got != want {
		t.Errorf("unexpected converted coin name: got: %v, want: %v", got, want)
		return
	}
}
