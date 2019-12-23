package service

import (
	"challenge-bravo/conversion-api/currency/mocks"
	"challenge-bravo/conversion-api/models"
	"context"
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

var testService service
var rr = new(mocks.Repository)
var gg = new(mocks.Gateway)

func TestMain(m *testing.M) {
	testService.Repository = rr
	testService.Gateway = gg

	result := m.Run()

	os.Exit(result)
}

func TestExchangeCurrency(t *testing.T) {
	type test struct {
		currencyFrom   string
		currencyTo     string
		amount         float64
		expectedResult models.CurrencyExchange
		expectedError  error
	}

	var tests = make(map[string]test)

	tests["SuccessfulTest"] = test{
		currencyFrom: "USD",
		currencyTo:   "BRL",
		amount:       100.00,
		expectedResult: models.CurrencyExchange{
			CurrencyFrom:   makeFakeCurrency(1, "USD", 1.00),
			CurrencyTo:     makeFakeCurrency(2, "BRL", 4.20),
			OriginalValue:  100.00,
			ExchangedValue: 420.00,
		},
		expectedError: nil,
	}

	tests["Invalid Currency From"] = test{
		currencyFrom:   "",
		currencyTo:     "BRL",
		amount:         100.00,
		expectedResult: models.CurrencyExchange{},
		expectedError:  fmt.Errorf("error invalid currency from"),
	}

	tests["Invalid Currency To"] = test{
		currencyFrom:   "USD",
		currencyTo:     "",
		amount:         100.00,
		expectedResult: models.CurrencyExchange{},
		expectedError:  fmt.Errorf("error invalid currency to"),
	}

	tests["Currency that doesn't exists"] = test{
		currencyFrom:   "USD",
		currencyTo:     "ZIG",
		amount:         100.00,
		expectedResult: models.CurrencyExchange{},
		expectedError:  fmt.Errorf("error Currency ZIG does not exists"),
	}

	tests["A more complex transaction"] = test{
		currencyFrom: "EUR",
		currencyTo:   "BRL",
		amount:       325.72,
		expectedResult: models.CurrencyExchange{
			CurrencyFrom:   makeFakeCurrency(1, "EUR", 0.90),
			CurrencyTo:     makeFakeCurrency(2, "BRL", 4.20),
			OriginalValue:  325.72,
			ExchangedValue: 1520.026666667,
		},
		expectedError: nil,
	}

	for title, test := range tests {
		gg.On("GetCurrency", context.Background(), test.currencyFrom).Return(test.expectedResult.CurrencyFrom)
		gg.On("GetCurrency", context.Background(), test.currencyTo).Return(test.expectedResult.CurrencyTo)
		t.Run(title, func(t *testing.T) {
			response, err := testService.ExchangeCurrency(context.Background(), test.currencyFrom, test.currencyTo, test.amount)

			if assert.Equalf(t, test.expectedError, err, "Fail! Was expecting error %s got: %s", test.expectedError, err) {
				assert.Equalf(t, test.expectedResult, response, "Fail! Was expecting response %#v\n got: %#v")
			}
		})
	}
}
func TestUpdateCurrency(t *testing.T) {

}
func TestCreateCurrency(t *testing.T) {

}

func makeFakeCurrency(id int64, currency string, ballast float64) models.Currency {
	return models.Currency{
		ID:              id,
		Name:            currency,
		BallastToDollar: ballast,
	}
}
