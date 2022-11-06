package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/challenge-bravo-flp/database"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func SetupTestsRoutes() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	routes := gin.Default()
	return routes
}

func CreateCurrencyMock(key string, description string, quotationType string) int {
	currency := models.Currency{Key: key, Description: description, QuotationType: quotationType}
	database.DB.Create(&currency)
	return int(currency.ID)
}

func DeleteCurrencyMock(id int) {
	var currency models.Currency
	database.DB.Delete(&currency, id)
}

func TestListCurrencies(t *testing.T) {
	database.ConnectDatabase()
	id := CreateCurrencyMock("USD", "USD description", "QuotationType")
	defer DeleteCurrencyMock(id)
	r := SetupTestsRoutes()
	r.GET("currency", ListCurrencies)

	req, _ := http.NewRequest("GET", "/currency", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
}

func TestCreateCurrencyWithNilValues(t *testing.T) {
	r := SetupTestsRoutes()
	r.POST("currency", CreateCurrency)

	req, _ := http.NewRequest("POST", "/currency", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	assert.Equal(t, http.StatusBadRequest, response.Code)
}

func TestCreateCurrency(t *testing.T) {
	r := SetupTestsRoutes()
	r.POST("currency", CreateCurrency)

	var jsonStr = []byte(`{"key":"created key", "description": "created description", "quotationType": "created quotationType"}`)

	req, _ := http.NewRequest("POST", "/currency", bytes.NewBuffer(jsonStr))
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	var expectedCurrency models.Currency
	json.Unmarshal(response.Body.Bytes(), &expectedCurrency)

	id := int(expectedCurrency.ID)
	defer DeleteCurrencyMock(id)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Equal(t, "created key", expectedCurrency.Key)
	assert.Equal(t, "created description", expectedCurrency.Description)
	assert.Equal(t, "created quotationType", expectedCurrency.QuotationType)
}

func TestShowCurrency(t *testing.T) {
	database.ConnectDatabase()
	id := CreateCurrencyMock("USD", "USD description", "QuotationType")
	defer DeleteCurrencyMock(id)
	r := SetupTestsRoutes()
	r.GET("/currency/:id", ShowCurrency)

	req, _ := http.NewRequest("GET", fmt.Sprintf("/currency/%d", id), nil)
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
	r.GET("/currency/:id", ShowCurrency)

	req, _ := http.NewRequest("GET", "/currency/1", nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Not found":"Currency not found"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusNotFound, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestDeleteCurrency(t *testing.T) {
	database.ConnectDatabase()
	id := CreateCurrencyMock("USD", "USD description", "QuotationType")
	r := SetupTestsRoutes()
	r.DELETE("/currency/:id", DeleteCurrency)

	urlPath := fmt.Sprintf("/currency/%d", id)
	req, _ := http.NewRequest("DELETE", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
}

func TestConvertCurrencyWithoutFromParam(t *testing.T) {
	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?to=%s&amount=%f", "EUR", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusBadRequest, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrencyWithoutToParam(t *testing.T) {
	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&amount=%f", "BTC", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"To parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusBadRequest, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrencyWithoutToAmount(t *testing.T) {
	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s", "BTC", "EUR")
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"Amount parameter is required"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusBadRequest, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrencyWithInvalidFrom(t *testing.T) {
	database.ConnectDatabase()
	toId := CreateCurrencyMock("EUR", "EUR description", "QuotationType")
	defer DeleteCurrencyMock(toId)

	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "BTC", "EUR", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"From currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusBadRequest, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrencyWithInvalidTo(t *testing.T) {
	database.ConnectDatabase()
	fromId := CreateCurrencyMock("BTC", "BTC description", "QuotationType")
	defer DeleteCurrencyMock(fromId)

	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "BTC", "EUR", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	expectedResponse := `{"Bad Request":"To currency does not exists or is not available to conversion"}`
	responseBody, _ := ioutil.ReadAll(response.Body)

	assert.Equal(t, http.StatusBadRequest, response.Code)
	assert.Equal(t, expectedResponse, string(responseBody))
}

func TestConvertCurrency(t *testing.T) {
	database.ConnectDatabase()
	btcId := CreateCurrencyMock("USD", "USD description", "QuotationType")
	eurId := CreateCurrencyMock("BRL", "BRL description", "QuotationType")
	defer DeleteCurrencyMock(btcId)
	defer DeleteCurrencyMock(eurId)

	r := SetupTestsRoutes()
	r.GET("conversion", ConvertCurrency)
	urlPath := fmt.Sprintf("/conversion?from=%s&to=%s&amount=%f", "USD", "BRL", 1.0)
	req, _ := http.NewRequest("GET", urlPath, nil)
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)

	var expectedConversion models.Conversion
	json.Unmarshal(response.Body.Bytes(), &expectedConversion)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Equal(t, "USD", expectedConversion.From)
	assert.Equal(t, "BRL", expectedConversion.To)
	assert.NotEqual(t, 0, expectedConversion.Amount)
	assert.NotEqual(t, 0, expectedConversion.Result)
}
