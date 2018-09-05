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
	API struct {
		Port int `json:"port"`
		TLS  struct {
			Enabled  bool   `json:"enabled"`
			CertPath string `json:"cert_path"`
			KeyPath  string `json:"key_path"`
		}
	} `json:"api"`
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
	return getEnvVar("GOCONFIGPATH")
}

func getOpenExchangeRatesAPIKey() string {
	return getEnvVar("OXRAPIKEY")
}

func getEnvVar(name string) string {
	apiKey, exists := os.LookupEnv(name)
	if !exists {
		log.Panic(name + " environment variable not set")
	}
	return apiKey
}
