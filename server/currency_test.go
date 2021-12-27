package server

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
)

const currencyEndPoint = "/api/v1/currency"

func TestCurrencyRoute(t *testing.T) {

	const codeNotExist = "XXAAXXAA"
	rate1 := 2.0
	rate2 := -1.0
	rate3 := 3.0
	testCurrency := model.Currency{
		Code: "TESTCUR",
		Name: "Test Currency",
		Rate: &rate1,
	}
	invalidCurrency := model.Currency{
		Code: "",
		Name: "",
		Rate: &rate2,
	}
	testCurrencyModified := model.Currency{
		Code: "TESTCUR",
		Name: "Modified Test Currency",
		Rate: &rate3,
	}
	testCurrencyModifiedInvalid := model.Currency{
		Code: "TESTCUR",
		Name: "",
		Rate: &rate2,
	}
	testCurrencyModifiedInvalidName := model.Currency{
		Code: "XXX",
		Name: "Modified Test Currency",
		Rate: &rate3,
	}
	testCurrencyModifyUSD := model.Currency{
		Code: "USD",
		Name: "Modified USD",
		Rate: &rate3,
	}
	testCurrencyModifyBTC := model.Currency{
		Code: "BTC",
		Name: "Modified BTC",
		Rate: &rate3,
	}

	tests := []Test{
		{
			description: "Creates a new currency",
			method:      http.MethodPost,
			route:       currencyEndPoint,
			payload:     testCurrency,
			statusCode:  http.StatusOK,
			response:    &model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*model.Currency)
				assert.Equal(t, resp.Code, testCurrency.Code, "returned currency code must be equal to the supplied", resp.Code, " != ", testCurrency.Code)
				assert.Equal(t, resp.Name, testCurrency.Name, "returned currency name must be equal to the supplied", resp.Name, " != ", testCurrency.Name)
				assert.Equal(t, string(resp.Type), "U", "returned currency type must be custom (U) != ", string(resp.Type))
				if resp.Rate != nil {
					assert.Equal(t, *resp.Rate, *testCurrency.Rate, "returned currency rate1 must be equal to the supplied", *resp.Rate, " != ", *testCurrency.Rate)
				}
			},
		}, {
			description: "Try to create a duplicated currency",
			method:      http.MethodPost,
			route:       currencyEndPoint,
			payload:     testCurrency,
			statusCode:  http.StatusConflict,
			asserts: func(t assert.TestingT, response interface{}) {
			},
		}, {
			description: "Try to create a invalid currency",
			method:      http.MethodPost,
			route:       currencyEndPoint,
			payload:     invalidCurrency,
			statusCode:  http.StatusBadRequest,
			response:    &dao.Error{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*dao.Error)
				assert.Len(t, resp.Errors, 3, "should return 3 error messages, but was returned", len(resp.Errors))
			},
		}, {
			description: "Get an invalid currency",
			method:      http.MethodGet,
			route:       currencyEndPoint + "/" + codeNotExist,
			statusCode:  http.StatusNotFound,
			asserts: func(t assert.TestingT, response interface{}) {
			},
		}, {
			description: "Get USD currency",
			method:      http.MethodGet,
			route:       currencyEndPoint + "/USD",
			statusCode:  http.StatusOK,
			response:    &model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*model.Currency)
				assert.Equal(t, resp.Code, "USD", "USD symbol should be USD not ", resp.Code)
			},
		}, {
			description: "Get BTC currency",
			method:      http.MethodGet,
			route:       currencyEndPoint + "/BTC",
			statusCode:  http.StatusOK,
			response:    &model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*model.Currency)
				assert.Equal(t, resp.Code, "BTC", "BTC symbol should be BTC not ", resp.Code)
			},
		}, {
			description: "Get a custom currency",
			method:      http.MethodGet,
			route:       currencyEndPoint + "/" + testCurrency.Code,
			statusCode:  http.StatusOK,
			response:    &model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*model.Currency)
				assert.Equal(t, resp.Code, testCurrency.Code, "returned currency code must be equal to the supplied", resp.Code, " != ", testCurrency.Code)
				assert.Equal(t, resp.Name, testCurrency.Name, "returned currency name must be equal to the supplied", resp.Name, " != ", testCurrency.Name)
				assert.Equal(t, string(resp.Type), "U", "returned currency type must be custom (U) != ", string(resp.Type))
				if resp.Rate != nil {
					assert.Equal(t, *resp.Rate, *testCurrency.Rate, "returned currency rate1 must be equal to the supplied", *resp.Rate, " != ", *testCurrency.Rate)
				}
			},
		}, {
			description: "Get currency list",
			method:      http.MethodGet,
			route:       currencyEndPoint,
			statusCode:  http.StatusOK,
			response:    &[]model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*[]model.Currency)
				assert.Greaterf(t, len(*resp), 200, "is expected a list of at least 200 elements but returned", len(*resp), "elements")
			},
		}, {
			description: "Modify a custom currency",
			method:      http.MethodPut,
			route:       currencyEndPoint + "/" + testCurrency.Code,
			payload:     testCurrencyModified,
			statusCode:  http.StatusOK,
			response:    &model.Currency{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*model.Currency)
				assert.Equal(t, resp.Code, testCurrencyModified.Code, "returned currency code must be equal to the supplied", resp.Code, " != ", testCurrencyModified.Code)
				assert.Equal(t, resp.Name, testCurrencyModified.Name, "returned currency name must be equal to the supplied", resp.Name, " != ", testCurrencyModified.Name)
				assert.Equal(t, string(resp.Type), "U", "returned currency type must be custom (U) != ", string(resp.Type))
				if resp.Rate != nil {
					assert.Equal(t, *resp.Rate, *testCurrencyModified.Rate, "returned currency rate1 must be equal to the supplied", *resp.Rate, " != ", *testCurrencyModified.Rate)
				}
			},
		}, {
			description: "Try to modify currency code",
			method:      http.MethodPut,
			route:       currencyEndPoint + "/" + testCurrency.Code,
			payload:     testCurrencyModifiedInvalidName,
			statusCode:  http.StatusForbidden,
			asserts: func(t assert.TestingT, response interface{}) {
			},
		}, {
			description: "Try to modify a real currency",
			method:      http.MethodPut,
			route:       currencyEndPoint + "/" + testCurrencyModifyUSD.Code,
			payload:     testCurrencyModifyUSD,
			statusCode:  http.StatusForbidden,
			asserts: func(t assert.TestingT, response interface{}) {
			},
		}, {
			description: "Try to modify a crypto currency",
			method:      http.MethodPut,
			route:       currencyEndPoint + "/" + testCurrencyModifyBTC.Code,
			payload:     testCurrencyModifyBTC,
			statusCode:  http.StatusForbidden,
			asserts: func(t assert.TestingT, response interface{}) {
			},
		}, {
			description: "Try to modify currency with invalid values",
			method:      http.MethodPut,
			route:       currencyEndPoint + "/" + testCurrency.Code,
			payload:     testCurrencyModifiedInvalid,
			statusCode:  http.StatusBadRequest,
			response:    &dao.Error{},
			asserts: func(t assert.TestingT, response interface{}) {
				resp := response.(*dao.Error)
				assert.Len(t, resp.Errors, 2, "should return 2 error messages, but was returned", len(resp.Errors))
			},
		}, {
			description: "Deletes a custom currency",
			method:      http.MethodDelete,
			route:       currencyEndPoint + "/" + testCurrency.Code,
			statusCode:  http.StatusOK,
			asserts:     func(t assert.TestingT, response interface{}) {},
		}, {
			description: "Try to delete a real currency",
			method:      http.MethodDelete,
			route:       currencyEndPoint + "/USD",
			statusCode:  http.StatusForbidden,
			asserts:     func(t assert.TestingT, response interface{}) {},
		}, {
			description: "Try to delete a crypto currency",
			method:      http.MethodDelete,
			route:       currencyEndPoint + "/BTC",
			statusCode:  http.StatusForbidden,
			asserts:     func(t assert.TestingT, response interface{}) {},
		}, {
			description: "Try to delete a custom currency that doesn't exist",
			method:      http.MethodDelete,
			route:       currencyEndPoint + "/" + codeNotExist,
			statusCode:  http.StatusNotFound,
			asserts:     func(t assert.TestingT, response interface{}) {},
		},
	}
	executeApiTest(tests, t)
}
