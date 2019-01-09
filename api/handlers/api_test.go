package api_test

import (
	api "challenge-bravo/api/handlers"
	"challenge-bravo/cache"
	"challenge-bravo/logger"
	"challenge-bravo/rates"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

var getLogger = logger.Log

func Router() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/health", api.HealthCheck).Methods("GET")
	router.HandleFunc("/api/v1/public/rates", api.GetAllRates).Methods("GET", "OPTIONS", "HEAD")
	router.HandleFunc("/api/v1/public/convert", api.GetRate).Methods("GET", "OPTIONS", "HEAD")
	router.Use(api.LoggingMiddleware)
	return router
}

// Test Healthcheck endpoint
func TestHealth(t *testing.T) {
	request, _ := http.NewRequest("GET", "/health", nil)
	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 200, response.Code, "OK response is expected")
	assert.Contains(t, response.Body.String(), `"status":"OK"`, "Assert status is equal OK")
}

// Test GetAll Rates - should return all rates
func TestGetAllRatesWithSuccess(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()
	request, _ := http.NewRequest("GET", "/api/v1/public/rates", nil)
	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 200, response.Code, "OK response is expected")
	assert.Contains(t, response.Body.String(), `"rates":{`, "Should respond with updated rates")
}

// Test GetAll Rates with Empty Cache - should return 500 (internal server error)
func TestGetAllRatesWithEmptyCache(t *testing.T) {
	cache.StartCache()

	// Cache may be empty - simulate unavailable rates update
	// rates.UpdateRates()

	request, _ := http.NewRequest("GET", "/api/v1/public/rates", nil)
	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 500, response.Code, "Internal Server error response is expected")
	assert.Contains(t, response.Body.String(), `Rates currently unavailable.`, "Should respond with 'Rates currently unavailable. Please try again.'")
}

// Test Get Rate with correctly fields - should return 200 and return converted currency values
func TestGetRate(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	request, _ := http.NewRequest("GET", "/api/v1/public/convert", nil)

	// Add FROM,TO, AMOUNT query parameters to request
	q := request.URL.Query()
	q.Add("from", "btc")
	q.Add("to", "brl")
	q.Add("amount", "2.2")
	request.URL.RawQuery = q.Encode()

	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 200, response.Code, "OK response is expected")
	assert.Contains(t, response.Body.String(), `{"base":"USD","from":{"symbol":"BTC"`, "Should respond with converted currency rates.")
}

// Test GetAll Rates with incorrect amount value - should return 400 (bad request)
func TestGetRateWithCommaAmount(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	request, _ := http.NewRequest("GET", "/api/v1/public/convert", nil)

	// Add FROM,TO, AMOUNT query parameters to request
	q := request.URL.Query()
	q.Add("from", "btc")
	q.Add("to", "brl")
	q.Add("amount", "2,2") // Using comma instead dot
	request.URL.RawQuery = q.Encode()

	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 400, response.Code, "Bad request response is expected")
	assert.Contains(t, response.Body.String(), `Invalid amount. Please use dots instead commas.`, "Should respond with error about using comma in amount.")
}

// Test GetAll Rates with incorrect amount value - should return 400 (bad request)
func TestGetRateWithUnsupportedCurrency(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	request, _ := http.NewRequest("GET", "/api/v1/public/convert", nil)

	// Add FROM,TO, AMOUNT query parameters to request
	q := request.URL.Query()
	q.Add("from", "BTX") // Unsupported currency
	q.Add("to", "brl")
	q.Add("amount", "2")
	request.URL.RawQuery = q.Encode()

	response := httptest.NewRecorder()
	Router().ServeHTTP(response, request)
	assert.Equal(t, 500, response.Code, "Internal Server error response is expected")
	assert.Contains(t, response.Body.String(), `Could not convert currency data`, "Should respond with error about 'Could not convert currency data'")
}
