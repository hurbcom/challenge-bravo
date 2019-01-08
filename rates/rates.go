package rates

import (
	"bytes"
	"curapi/cache"
	"curapi/logger"
	"curapi/util"
	"errors"
	"io/ioutil"
	"strconv"

	jsoniter "github.com/json-iterator/go"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log

const (
	ratesAPIURL    = "https://ratesapi.io/api/latest?base=USD"
	coinbaseAPIURL = "https://api.coinbase.com/v2/prices/"
)

// RatesResponse : struct that holds data from Rates API
type RatesResponse struct {
	Base  string             `json:"base"`
	Rates map[string]float64 `json:"rates"`
}

// CoinbaseResponse : struct that holds data from Coinbase API
type CoinbaseResponse struct {
	Data struct {
		Amount *string `json:"amount"`
	} `json:"data"`
}

// UpdateRates :: Function responsible to get, collect and update rates in Cache service
func UpdateRates() {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	log.Info("• Fetching currency rates..")

	// Collect all rate data
	mRates, err := GetRatesFromRatesAPI()
	if err != nil {
		log.Error(err)
	}

	mBTC, err := GetRatesFromCoinbaseAPI("BTC")
	if err != nil {
		log.Error(err)
	}

	mETH, err := GetRatesFromCoinbaseAPI("ETH")
	if err != nil {
		log.Error(err)
	}

	// Merging all map values
	for k, v := range mBTC {
		mRates[k] = v
	}

	for k, v := range mETH {
		mRates[k] = v
	}

	// Add USD unit to reuse converter logic
	mRates["USD"] = "1"

	// Save rates values in cache
	for k, v := range mRates {
		err := cache.Set(k, v)
		if err != nil {
			log.Error(err)
		}
	}

	log.Info("• Rates updated!")
}

// GetRatesFromRatesAPI :: Function to get rates from RatesAPI service
func GetRatesFromRatesAPI() (map[string]string, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	// Initialize map to store our data
	var rates = make(map[string]string)

	// Create request headers
	headers := make(map[string]string)
	headers["Connection"] = "close"
	headers["Accept"] = "application/json"
	headers["Content-type"] = "application/json; charset=utf-8"
	responses := &RatesResponse{}
	request := &util.Request{Headers: headers, Params: nil, Body: nil}

	// Fire request
	ratesResponse, err := util.ExecuteRequest("GET", ratesAPIURL, request)
	if err != nil {
		log.Error(err)
	}

	// Read and parse results (body)
	resp, _ := ioutil.ReadAll(ratesResponse.Body)
	defer ratesResponse.Body.Close()

	if resp != nil && len(resp) > 2 {
		err := jsoniter.NewDecoder(ioutil.NopCloser(bytes.NewBuffer(resp))).Decode(&responses)
		if err != nil {
			log.Error(err.Error())
		}

		// Feed our map with responses from API
		for cur, val := range responses.Rates {
			rates[cur] = strconv.FormatFloat(val, 'f', 4, 64)
		}

		if rates != nil {
			return rates, nil
		}
	}
	return nil, errors.New("Error getting rates from Rates API")
}

// GetRatesFromCoinbaseAPI :: Function to get rates from Coinbase service
func GetRatesFromCoinbaseAPI(currency string) (map[string]string, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	// Initialize map to store our data
	var rates = make(map[string]string)

	// Create request headers
	headers := make(map[string]string)
	headers["Connection"] = "close"
	headers["Accept"] = "application/json"
	headers["Content-type"] = "application/json; charset=utf-8"
	responses := &CoinbaseResponse{}
	request := &util.Request{Headers: headers, Params: nil, Body: nil}

	// Fire request
	coinbaseResponse, err := util.ExecuteRequest("GET", coinbaseAPIURL+currency+"-USD/sell", request)
	if err != nil {
		log.Error(err)
	}

	// Read and parse results (body)
	resp, _ := ioutil.ReadAll(coinbaseResponse.Body)
	defer coinbaseResponse.Body.Close()

	if resp != nil && len(resp) > 2 {
		err := jsoniter.NewDecoder(ioutil.NopCloser(bytes.NewBuffer(resp))).Decode(&responses)
		if err != nil {
			log.Error(err.Error())
		}

		// Feed our map with responses from API
		if responses.Data.Amount != nil {
			var rateValue float64

			value, _ := strconv.ParseFloat(*responses.Data.Amount, 64)
			rateValue = 1 / value
			rates[currency] = strconv.FormatFloat(rateValue, 'f', 8, 64)
			return rates, nil
		}
	}
	return nil, errors.New("Error getting rates from Coinbase API")
}
