package config

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

// Config represents the worker's config file
type Config struct {
	MasterWorker struct {
		UpdateInterval int `json:"update_interval"`
		Port           int `json:"port"`
		QuotesAPIURL   struct {
			OpenExchangeRates string `json:"openexchangerates"`
			CoinMarketCap     string `json:"coinmarketcap"`
		} `json:"quotes_api_url"`
		APIKeys struct {
			OpenExchangeRates string
		}
	} `json:"master_worker"`
	SlaveWorker struct {
		UpdateInterval  int    `json:"update_interval"`
		MasterWorkerURL string `json:"master_worker_url"`
	} `json:"slave_worker"`
	API struct {
		Port int `json:"port"`
		TLS  struct {
			Enabled  bool   `json:"enabled"`
			CertPath string `json:"cert_path"`
			KeyPath  string `json:"key_path"`
		} `json:"api"`
	} `json:"api"`
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
	return *config
}

// LoadAPIKey loads API Key for OpenExchangeRates
func (config *Config) LoadAPIKey() {
	config.MasterWorker.APIKeys.OpenExchangeRates = getOpenExchangeRatesAPIKey()
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
