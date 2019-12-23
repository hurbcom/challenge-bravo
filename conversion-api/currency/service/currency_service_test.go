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
		currencyFrom: "USD",
		currencyTo:   "",
		amount:       100.00,
		expectedResult: models.CurrencyExchange{
			CurrencyFrom: makeFakeCurrency(1, "USD", 1.00),
		},
		expectedError: fmt.Errorf("error invalid currency to"),
	}

	tests["Currency that doesn't exists"] = test{
		currencyFrom: "USD",
		currencyTo:   "ZIG",
		amount:       100.00,
		expectedResult: models.CurrencyExchange{
			CurrencyFrom: makeFakeCurrency(1, "USD", 1.00),
		},
		expectedError: fmt.Errorf("error Currency ZIG does not exists"),
	}

	tests["A more complex transaction"] = test{
		currencyFrom: "EUR",
		currencyTo:   "BRL",
		amount:       325.72,
		expectedResult: models.CurrencyExchange{
			CurrencyFrom:   makeFakeCurrency(1, "EUR", 0.90),
			CurrencyTo:     makeFakeCurrency(2, "BRL", 4.20),
			OriginalValue:  325.72,
			ExchangedValue: 1520.0266666666669,
		},
		expectedError: nil,
	}

	for title, test := range tests {
		t.Run(title, func(t *testing.T) {
			rr.On("GetCurrency", context.Background(), test.currencyFrom).Return(test.expectedResult.CurrencyFrom, test.expectedError).Once()
			rr.On("GetCurrency", context.Background(), test.currencyTo).Return(test.expectedResult.CurrencyTo, test.expectedError).Once()
			response, err := testService.ExchangeCurrency(context.Background(), test.currencyFrom, test.currencyTo, test.amount)

			if assert.Equalf(t, test.expectedError, err, "Fail! Was expecting error %s got: %s", test.expectedError, err) {
				assert.Equalf(t, test.expectedResult, response, "Fail! Was expecting response %#v\n got: %#v")
			}
		})
	}
}
func TestUpdateCurrency(t *testing.T) {
	type test struct {
		currency       string
		oldCurrency    models.Currency
		expectedResult models.Currency
		expectedError  error
	}

	var tests = make(map[string]test)

	tests["SuccessfulTest"] = test{
		currency:       "USD",
		oldCurrency:    makeFakeCurrency(1, "USD", 1),
		expectedResult: makeFakeCurrency(1, "USD", 1),
		expectedError:  nil,
	}

	tests["Invalid Currency"] = test{
		currency:       "",
		oldCurrency:    makeFakeCurrency(0, "", 0),
		expectedResult: makeFakeCurrency(0, "", 0),
		expectedError:  fmt.Errorf("error invalid currency"),
	}

	tests["Currency does not exists on our database"] = test{
		currency:       "Yen",
		oldCurrency:    makeFakeCurrency(0, "", 0),
		expectedResult: makeFakeCurrency(0, "", 0),
		expectedError:  fmt.Errorf("Currency does not exists on our database"),
	}

	tests["Complex Success"] = test{
		currency:       "BRL",
		oldCurrency:    makeFakeCurrency(2, "BRL", 4.10),
		expectedResult: makeFakeCurrency(2, "BRL", 4.20),
		expectedError:  nil,
	}

	for title, test := range tests {
		t.Run(title, func(t *testing.T) {
			rr.On("GetCurrency", context.Background(), test.currency).Return(test.oldCurrency, test.expectedError).Once()
			rr.On("UpdateBallast", context.Background(), test.expectedResult).Return(test.expectedError).Once()
			gg.On("GetCurrencyByName", test.currency).Return(test.expectedResult, test.expectedError).Once()
			response, err := testService.UpdateCurrency(context.Background(), test.currency)

			if assert.Equalf(t, test.expectedError, err, "Fail! Was expecting error %s got: %s", test.expectedError, err) {
				assert.Equalf(t, test.expectedResult, response, "Fail! Was expecting response %#v\n got: %#v")
			}
		})
	}
}
func TestCreateCurrency(t *testing.T) {
	type test struct {
		currency       string
		oldResult      models.Currency
		expectedResult models.Currency
		expectedError  error
	}

	var tests = make(map[string]test)

	tests["SuccessfulTest"] = test{
		currency:       "Yen",
		oldResult:      makeFakeCurrency(0, "", 0),
		expectedResult: makeFakeCurrency(1, "Yen", 109.40),
		expectedError:  nil,
	}

	tests["Invalid Currency"] = test{
		currency:       "",
		expectedResult: makeFakeCurrency(0, "", 0),
		expectedError:  fmt.Errorf("error invalid currency"),
	}

	tests["Currency already exists on our database"] = test{
		currency:       "USD",
		oldResult:      makeFakeCurrency(1, "USD", 1),
		expectedResult: makeFakeCurrency(1, "USD", 1),
		expectedError:  fmt.Errorf("Currency already exists on our database"),
	}

	for title, test := range tests {
		t.Run(title, func(t *testing.T) {
			rr.On("GetCurrency", context.Background(), test.currency).Return(test.oldResult, test.expectedError).Once()
			rr.On("InsertCurrency", context.Background(), test.expectedResult).Return(test.expectedResult, test.expectedError).Once()
			gg.On("GetCurrencyByName", test.currency).Return(test.expectedResult, test.expectedError).Once()
			response, err := testService.CreateCurrency(context.Background(), test.currency)

			if assert.Equalf(t, test.expectedError, err, "Fail! Was expecting error %s got: %s", test.expectedError, err) {
				assert.Equalf(t, test.expectedResult, response, "Fail! Was expecting response %#v\n got: %#v")
			}
		})
	}
}

func makeFakeCurrency(id int64, currency string, ballast float64) models.Currency {
	return models.Currency{
		ID:              id,
		Name:            currency,
		BallastToDollar: ballast,
	}
}
