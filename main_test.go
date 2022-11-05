package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/controllers"
	"github.com/felipepnascimento/challenge-bravo-flp/database"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var ID int

func SetupTestsRoutes() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	routes := gin.Default()
	return routes
}

func CreateCurrencyMock() {
	currency := models.Currency{Key: "USD", Description: "USD description", QuotationType: "QuotationType"}
	database.DB.Create(&currency)
	ID = int(currency.ID)
}

func DeleteCurrencyMock() {
	var currency models.Currency
	database.DB.Delete(&currency, ID)
}

func TestListCurrencies(t *testing.T) {
	database.ConnectDatabase()
	CreateCurrencyMock()
	defer DeleteCurrencyMock()
	r := SetupTestsRoutes()
	r.GET("currency", controllers.ListCurrencies)

	req, _ := http.NewRequest("GET", "/currency", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
}

func TestCreateCurrencyWithNilValues(t *testing.T) {
	r := SetupTestsRoutes()
	r.POST("currency", controllers.CreateCurrency)

	req, _ := http.NewRequest("POST", "/currency", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	assert.Equal(t, http.StatusBadRequest, response.Code)
}

func TestCreateCurrency(t *testing.T) {
	database.ConnectDatabase()
	defer DeleteCurrencyMock()

	r := SetupTestsRoutes()
	r.POST("currency", controllers.CreateCurrency)

	var jsonStr = []byte(`{"key":"created key", "description": "created description", "quotationType": "created quotationType"}`)

	req, _ := http.NewRequest("POST", "/currency", bytes.NewBuffer(jsonStr))
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	var expectedCurrency models.Currency
	json.Unmarshal(response.Body.Bytes(), &expectedCurrency)

	ID = int(expectedCurrency.ID)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Equal(t, "created key", expectedCurrency.Key)
	assert.Equal(t, "created description", expectedCurrency.Description)
	assert.Equal(t, "created quotationType", expectedCurrency.QuotationType)
}

func TestShowCurrency(t *testing.T) {
	database.ConnectDatabase()
	CreateCurrencyMock()
	defer DeleteCurrencyMock()
	r := SetupTestsRoutes()
	r.GET("currency/:id", controllers.ShowCurrency)

	req, _ := http.NewRequest("GET", fmt.Sprintf("/currency/%d", ID), nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	var expectedCurrency models.Currency
	json.Unmarshal(response.Body.Bytes(), &expectedCurrency)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Equal(t, "USD", expectedCurrency.Key)
	assert.Equal(t, "USD description", expectedCurrency.Description)
	assert.Equal(t, "QuotationType", expectedCurrency.QuotationType)
}

func TestShowCurrencyNotFound(t *testing.T) {
	r := SetupTestsRoutes()
	r.GET("currency/:id", controllers.ShowCurrency)

	req, _ := http.NewRequest("GET", "/currency/1", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Not found":"Currency not found"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusNotFound, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrency(t *testing.T) {
	r := SetupTestsRoutes()
	r.GET("conversion", controllers.ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "BTC", "EUR", 2.10)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	var expectedConversion models.Conversion
	json.Unmarshal(response.Body.Bytes(), &expectedConversion)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Equal(t, "BTC", expectedConversion.From)
	assert.Equal(t, "EUR", expectedConversion.To)
	assert.Equal(t, float32(2.1), expectedConversion.Amount)
	assert.Equal(t, float32(4.2), expectedConversion.Result)
}
