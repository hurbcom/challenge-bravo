package rates_test

import (
	"challenge-bravo/cache"
	"challenge-bravo/logger"
	"challenge-bravo/rates"
	"challenge-bravo/util"
	"net/http"
	"testing"

	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
	httpmock "gopkg.in/jarcoal/httpmock.v1"
)

var getLogger = logger.Log

const (
	ratesAPIURL    = "https://ratesapi.io/api/latest?base=USD"
	coinbaseAPIURL = "https://api.coinbase.com/v2/prices/BTC-USD/sell"
)

// Test Update Rates - first returned var should be true
func TestUpdateRates(t *testing.T) {
	// Start Cache
	cache.StartCache()
	updated := rates.UpdateRates()
	assert.True(t, updated, "Rates should be updated")
}

// Test Get Rates from RatesAPI - assert that one call was made to mocked responder
func TestGetRatesFromRatesAPI(t *testing.T) {
	// Register mock for external API endpoints
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	// External Vendor Apis
	registerMockResponder(http.MethodGet, ratesAPIURL, "ratesAPI", 200)

	// Fire request
	rates.GetRatesFromRatesAPI()

	// Get the amount of calls for the registered responders
	assertCallsMade(t, http.MethodGet, ratesAPIURL, 1)
}

// Test Get Rates from CoinbaseAPI - assert that one call was made to mocked responder
func TestGetRatesFromCoinbaseAPI(t *testing.T) {
	// Register mock for external API endpoints
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	// External Vendor Apis
	registerMockResponder(http.MethodGet, coinbaseAPIURL, "coinbaseAPI", 200)

	// Fire request
	rates.GetRatesFromCoinbaseAPI("BTC")

	// Get the amount of calls for the registered responders
	assertCallsMade(t, http.MethodGet, coinbaseAPIURL, 1)
}

// Registers Mock endpoint responders for API calls
func registerMockResponder(httpMethod, apiUrl, apiType string, status int) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	log.Infof("• Mocking external calls: %s %d - %s\n", httpMethod, status, apiUrl)

	switch apiType {
	case "ratesAPI":
		body := []byte(`{"base":"USD","date":"2019-01-08","rates":{"AUD":1.4023,"BGN":1.7096,"BRL":3.7241,"CAD":1.3294,"CHF":0.9818,"CNY":6.8536,"CZK":22.4143,"DKK":6.5265,"EUR":0.8741,"GBP":0.7845,"HKD":7.8384,"HRK":6.4944,"HUF":281.5997,"IDR":14145,"ILS":3.6986,"INR":70.1442,"ISK":118.9685,"JPY":108.7937,"KRW":1126.4161,"MXN":19.3705,"MYR":4.113,"NOK":8.5446,"NZD":1.488,"PHP":52.4974,"PLN":3.7635,"RON":4.083,"RUB":67.0627,"SEK":8.9034,"SGD":1.3592,"THB":32.0848,"TRY":5.494,"ZAR":14.0179}}`)
		httpmock.RegisterResponder(httpMethod, apiUrl, httpmock.NewBytesResponder(status, body))
		break
	case "coinbaseAPI":
		body := []byte(`{"data":{"base":"BTC","currency":"USD","amount":"3974.37"}}`)
		httpmock.RegisterResponder(httpMethod, apiUrl, httpmock.NewBytesResponder(status, body))
		break
	}
}

// Assert the external calls quantity
func assertCallsMade(t *testing.T, httpMethod, url string, expected int) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	info := httpmock.GetCallCountInfo()
	count := info[httpMethod+" "+url]
	assert.Equal(t, expected, count)
	log.Infof("• Total External API Calls made to %s: %d\n", url, count)
}
