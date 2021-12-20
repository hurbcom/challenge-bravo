package main

import (
	"api/connections"
	"api/router"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Connect() {
	// Try connect MySQL database in interval
	database, err := connections.OpenMysqlDB("mysql", "usr_database:123Mudar!@tcp(mysql:3306)/exchange_rate?collation=utf8_general_ci&parseTime=true", 1*time.Second)
	if err != nil {
		log.Println(err)
	}

	router.MySql = database
	// Connect redis database
	router.Redis = connections.OpenRedis()
}

func TestStatusHandler(t *testing.T) {
	assert.HTTPStatusCode(t, router.StatusHandler, "GET", "/status", nil, 200)
	assert.HTTPBodyContains(t, router.StatusHandler, "GET", "/status", nil, "API is up and running")
}

func TestGetExchangeRates(t *testing.T) {
	Connect()
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)
	query := url.Values{}
	query.Add("from", "BRL")
	query.Add("to", "USD")
	query.Add("amount", "1.00")

	w := httptest.NewRecorder()
	r, _ := http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "BRL-USD", "Error get data contain")

	query.Del("from")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 400, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "not present", "Error send empty param")

	query.Set("from", "HURB")
	query.Set("to", "WWW")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 500, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "false", "Error fictitious currency code")

	query.Set("from", "GBP")
	query.Set("to", "AFN")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "GBP-AFN", "Error save real currency code")

	query.Set("from", "GBP")
	query.Set("to", "ALL")
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodGet, "/exchange-rate?"+query.Encode(), nil)
	router.GetExchangeRates(w, r)
	assert.Equal(t, 200, w.Code, "Error http status request")
	assert.Contains(t, w.Body.String(), "GBP-", "Error get all exchange rates from currency code")
}

func TestDeleteCurrencyCodeAndExchangeRate(t *testing.T) {
	Connect()
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)

	query := url.Values{"Code": []string{}}
	w := httptest.NewRecorder()
	r, _ := http.NewRequest(http.MethodDelete, "/currency-codes/"+query.Encode(), nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 400, w.Code, "Error http status request delete")
	assert.Contains(t, w.Body.String(), "false", "Error delete empty currency code")

	query = url.Values{"Code": []string{"GBP"}}
	w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodDelete, "/currency-codes/"+query.Encode(), nil)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 400, w.Code, "Error http status request delete")
	assert.Contains(t, w.Body.String(), "false", "Error incorrect data send")

	/*w = httptest.NewRecorder()
	r, _ = http.NewRequest(http.MethodDelete, "/currency-codes/GBP", nil)
	r.Header.Add("Content-Type", "application/json")
	log.Printf("%v", r)
	router.DeleteCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 200, w.Code, "Error deleted data")*/
}

func TestSaveCurrencyCodeAndExchangeRate(t *testing.T) {
	Connect()
	assert.NotEmpty(t, router.MySql)
	assert.NotEmpty(t, router.Redis)
	assert.HTTPStatusCode(t, router.SaveCurrencyCodeAndExchangeRate, "POST", "/currency-codes", url.Values{}, 400)

	postBody, _ := json.Marshal(map[string]string{
		"Code": "BRL",
	})
	responseBody := bytes.NewBuffer(postBody)
	w := httptest.NewRecorder()
	r, _ := http.NewRequest("POST", "/currency-codes", responseBody)
	r.Header.Add("Content-Type", "application/json")
	router.SaveCurrencyCodeAndExchangeRate(w, r)
	assert.Equal(t, 201, w.Code, "Error http status request post")
	assert.Contains(t, w.Body.String(), "true", "Error save data")
}
