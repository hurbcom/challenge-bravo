package config

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

// Config represents the worker's config file
type Config struct {
	WorkerUpdateInterval int `json:"worker_update_interval"`
	QuotesAPIURL         struct {
		OpenExchangeRates string `json:"openexchangerates"`
		CoinMarketCap     string `json:"coinmarketcap"`
	} `json:"quotes_api_url"`
	APIKeys struct {
		OpenExchangeRates string
	}
}

var config *Config

// Load is a function to load configs based on GOENV environment variable (dev, test, prod)
func Load() Config {
	if config != nil {
		return *config
	}
	file, e := ioutil.ReadFile(getFilename())
	if e != nil {
		log.Fatalf("Error while reading config file: %v\n", e)
	}
	config = &Config{}
	if json.Unmarshal(file, config) != nil {
		log.Fatalf("Error while parsing config file: %v\n", e)
	}
	config.APIKeys.OpenExchangeRates = getOpenExchangeRatesAPIKey()
	return *config
}

func getFilename() string {
	configPath, exists := os.LookupEnv("GOCONFIGPATH")
	if !exists {
		panic("GOCONFIGPATH environment variable not set")
	}
	return configPath
}

func getOpenExchangeRatesAPIKey() string {
	apiKey, exists := os.LookupEnv("OXRAPIKEY")
	if !exists {
		panic("OXRAPIKEY environment variable not set")
	}
	return apiKey
}
