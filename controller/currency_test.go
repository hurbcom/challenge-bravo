package controller

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	mock_usecase "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/mock/usecase"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/usecase"
	"github.com/hashicorp/go-hclog"
	"github.com/stretchr/testify/assert"
)

func TestInsertDeserializingError(t *testing.T) {
	log := hclog.Default()
	mockUserCaseCurrency := new(mock_usecase.MockCurrency)

	controllerCurrency := NewCurrency(mockUserCaseCurrency, log)

	var jsonReq = []byte("")

	// Create a new HTTP POST request
	req, _ := http.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonReq))

	// Assign HTTP Handler function (controller currency insert function)
	handler := http.HandlerFunc(controllerCurrency.Insert)

	// Record HTTP response (httptest)
	res := httptest.NewRecorder()

	// Dispatch the HTTP request
	handler.ServeHTTP(res, req)

	// Add Assertions on the HTTP status code and the response
	assert.Equal(t, http.StatusBadRequest, res.Code)

	var responseError model.Error
	// Decode the HTTP response
	json.NewDecoder(res.Body).Decode(&responseError)

	assert.Equal(t, float32(400.1), responseError.Code)
	assert.Equal(t, "Error deserializing currency", responseError.Message)
}

func TestInsertValidatingError(t *testing.T) {
	log := hclog.Default()
	mockUserCaseCurrency := new(mock_usecase.MockCurrency)

	currency := &model.Currency{}
	errorMessage := "validating error"

	mockUserCaseCurrency.On("Insert").Return(currency, usecase.ErrCurrencyValidate{Message: errorMessage})

	controllerCurrency := NewCurrency(mockUserCaseCurrency, log)

	var jsonReq, _ = json.Marshal(currency)

	// Create a new HTTP POST request
	req, _ := http.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonReq))

	// Assign HTTP Handler function (controller currency insert function)
	handler := http.HandlerFunc(controllerCurrency.Insert)

	// Record HTTP response (httptest)
	res := httptest.NewRecorder()

	// Dispatch the HTTP request
	handler.ServeHTTP(res, req)

	// Add Assertions on the HTTP status code and the response
	assert.Equal(t, http.StatusBadRequest, res.Code)

	var responseError model.Error
	// Decode the HTTP response
	json.NewDecoder(res.Body).Decode(&responseError)

	assert.Equal(t, float32(400.2), responseError.Code)
	assert.Equal(t, fmt.Sprintf("Error validating currency: %v", errorMessage), responseError.Message)
}

func TestInsertDatabaseDuplicateKeyError(t *testing.T) {
	log := hclog.Default()
	mockUserCaseCurrency := new(mock_usecase.MockCurrency)

	currency := &model.Currency{}
	errExpected := repository.ErrDuplicateKey{Message: "duplicate key"}

	mockUserCaseCurrency.On("Insert").Return(currency, errExpected)

	controllerCurrency := NewCurrency(mockUserCaseCurrency, log)

	var jsonReq, _ = json.Marshal(currency)

	// Create a new HTTP POST request
	req, _ := http.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonReq))

	// Assign HTTP Handler function (controller currency insert function)
	handler := http.HandlerFunc(controllerCurrency.Insert)

	// Record HTTP response (httptest)
	res := httptest.NewRecorder()

	// Dispatch the HTTP request
	handler.ServeHTTP(res, req)

	// Add Assertions on the HTTP status code and the response
	assert.Equal(t, http.StatusBadRequest, res.Code)

	var responseError model.Error
	// Decode the HTTP response
	json.NewDecoder(res.Body).Decode(&responseError)

	assert.Equal(t, float32(400.5), responseError.Code)
	assert.Contains(t, fmt.Sprintf("Error insert currency in database: %v", errExpected.Message), responseError.Message)
}

func TestInsertDatabaseError(t *testing.T) {
	log := hclog.Default()
	mockUserCaseCurrency := new(mock_usecase.MockCurrency)

	currency := &model.Currency{}
	errorMessage := "error insert in database"

	mockUserCaseCurrency.On("Insert").Return(currency, errors.New(errorMessage))

	controllerCurrency := NewCurrency(mockUserCaseCurrency, log)

	var jsonReq, _ = json.Marshal(currency)

	// Create a new HTTP POST request
	req, _ := http.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonReq))

	// Assign HTTP Handler function (controller currency insert function)
	handler := http.HandlerFunc(controllerCurrency.Insert)

	// Record HTTP response (httptest)
	res := httptest.NewRecorder()

	// Dispatch the HTTP request
	handler.ServeHTTP(res, req)

	// Add Assertions on the HTTP status code and the response
	assert.Equal(t, http.StatusInternalServerError, res.Code)

	var responseError model.Error
	// Decode the HTTP response
	json.NewDecoder(res.Body).Decode(&responseError)

	assert.Equal(t, float32(500.1), responseError.Code)
	assert.Contains(t, fmt.Sprintf("Error insert currency in database: %v", errorMessage), responseError.Message)
}

func TestInsertSuccess(t *testing.T) {
	log := hclog.Default()
	mockUserCaseCurrency := new(mock_usecase.MockCurrency)

	referenceDateString, _ := time.Parse("2006-01-02", "2022-02-01")

	currency := &model.Currency{
		ShortName:     "TEST",
		RateUSD:       1.23,
		ReferenceDate: referenceDateString,
	}

	mockUserCaseCurrency.On("Insert").Return(currency, nil)

	controllerCurrency := NewCurrency(mockUserCaseCurrency, log)

	var jsonReq, _ = json.Marshal(currency)

	// Create a new HTTP POST request
	req, _ := http.NewRequest(http.MethodPost, "/currency", bytes.NewBuffer(jsonReq))

	// Assign HTTP Handler function (controller currency insert function)
	handler := http.HandlerFunc(controllerCurrency.Insert)

	// Record HTTP response (httptest)
	res := httptest.NewRecorder()

	// Dispatch the HTTP request
	handler.ServeHTTP(res, req)

	// Add Assertions on the HTTP status code and the response
	assert.Equal(t, http.StatusCreated, res.Code)

	var currencyResult model.Currency
	// Decode the HTTP response
	json.NewDecoder(res.Body).Decode(&currencyResult)

	assert.NotEqual(t, currency.ID, currencyResult.ID)
	assert.Equal(t, currency.ShortName, currencyResult.ShortName)
	assert.Equal(t, currency.RateUSD, currencyResult.RateUSD)
	assert.Equal(t, currency.ReferenceDate, currencyResult.ReferenceDate)
	assert.NotEqual(t, currency.CreatedAt, currencyResult.CreatedAt)
}
