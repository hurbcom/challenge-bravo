package main

import (
	"api/connections"
	"api/models"
	"api/router"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"
	"time"

	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
)

// Execute before and after tests
func TestMain(m *testing.M) {
	// Try connect MySQL database in interval
	database, err := connections.OpenMysqlDB("mysql", "usr_database:123Mudar!@tcp(mysql:3306)/exchange_rate?collation=utf8_general_ci&parseTime=true", 1*time.Second)
	if err != nil {
		log.Println(err)
	}

	router.MySql = database
	// Connect redis database
	router.Redis = connections.OpenRedis()

	exit := m.Run()

	database.Close()

	os.Exit(exit)
}

// Test Api status
func TestStatusHandler(t *testing.T) {
	assert.HTTPStatusCode(t, router.StatusHandler, "GET", "/status", nil, 200)
	assert.HTTPBodyContains(t, router.StatusHandler, "GET", "/status", nil, "API is up and running")
}

// Test save currency code and exchange rates
func TestSaveCurrencyCodeAndExchangeRate(t *testing.T) {
	// Test database connection
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)
	// Test save withou params
	assert.HTTPStatusCode(t, router.SaveCurrencyCodeAndExchangeRate, http.MethodPost, "/currency-codes", url.Values{}, 400)

	// Test save with currency code only
	NewCurrencyCode := models.CurrencyCode{Code: "HURB"}
	var NewExchangeRate []models.ExchangeRate
	NewExchangeRate = append(NewExchangeRate, models.ExchangeRate{Code: "USD", Historical: "", Rate: decimal.NewFromFloat(0.1234)})
	NewExchangeRate = append(NewExchangeRate, models.ExchangeRate{Code: "BRL", Historical: "", Rate: decimal.NewFromFloat(0.5678)})
	NewCurrencyCode.Rates = NewExchangeRate

	postBody, _ := json.Marshal(NewCurrencyCode)
	sendBody := bytes.NewBuffer(postBody)
	w := httptest.NewRecorder()
	r, _ := http.NewRequest(http.MethodPost, "/currency-codes", sendBody)
	r.Header.Add("Content-Type", "application/json")
	router.SaveCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 201, w.Code, "Error http status request post")
	assert.Contains(t, w.Body.String(), "true", "Error save data")
}

// Test get converted amount
func TestGetExchangeRates(t *testing.T) {
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)
	query := url.Values{}
	query.Add("from", "HURB")
	query.Add("to", "USD")
	query.Add("amount", "1.00")

	// Try send normal request
	w := httptest.NewRecorder()
	r, _ := http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "HURB-USD", "Error get data contain")

	// Try get without mandatory params
	query.Del("from")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 400, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "not present", "Error send empty param")

	// Try get fictitious currency code
	query.Set("from", "DDD")
	query.Set("to", "WWW")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "null", "Error fictitious currency code")

	// Try get from new currency code
	query.Set("from", "GBP")
	query.Set("to", "AFN")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "GBP-AFN", "Error save real currency code")

	// Try get all converted data from new currency code
	query.Set("from", "GBP")
	query.Set("to", "ALL")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "GBP-", "Error get all exchange rates from currency code")
}

// Test delete currency code and exchange rates
func TestDeleteCurrencyCodeAndExchangeRate(t *testing.T) {
	// Test database connection
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)

	// Test delete from empty param in request
	query := url.Values{"Code": []string{}}
	w := httptest.NewRecorder()
	r, _ := http.NewRequest(http.MethodDelete, "/currency-codes/"+query.Encode(), nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 400, w.Code, "Error http status request delete")
	assert.Contains(t, w.Body.String(), "false", "Error delete empty currency code")

	// Test delete from invalid param format
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodDelete, "/currency-codes/GBP", nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 400, w.Code, "Error deleted data")

	// Test deleted successfull
	query = url.Values{}
	query.Set("code", "GBP")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodDelete, "/currency-codes?"+query.Encode(), nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request delete")
	assert.Contains(t, w.Body.String(), "Currency code successfull deleted", "Error incorrect data send")

	query = url.Values{}
	query.Set("code", "HURB")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodDelete, "/currency-codes?"+query.Encode(), nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request delete")
	assert.Contains(t, w.Body.String(), "Currency code successfull deleted", "Error incorrect data send")
}
