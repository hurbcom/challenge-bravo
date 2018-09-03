package config

import (
	"encoding/json"
	"fmt"
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

func getFilename() string {
	return fmt.Sprintf("./config/config.%s.json", loadGoEnv())
}

func loadGoEnv() string {
	env, exists := os.LookupEnv("GOENV")
	if !exists {
		env = "dev"
	}
	log.Println("Envoriment loaded:", env)
	return env
}
