package config

/**
  Config file mapping and loading logic.
*/

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type AppConfig struct {
	API struct {
		Host string `json:"host"`
		Port int    `json:"port"`
	} `json:"api"`
	Worker struct {
		Host           string `json:"host"`
		Port           int    `json:"port"`
		UpdateInterval int64  `json:"updateInterval"`
		ExternalAPIs   struct {
			OpenExchangeRates struct {
				URL    string `json:"url"`
				APIKey string `json:"apiKey"`
			} `json:"openExchangeRates"`
			Fixer struct {
				URL    string `json:"url"`
				APIKey string `json:"apiKey"`
			} `json:"fixer"`
		} `json:"externalApis"`
	}
	Redis struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		Password string `json:"password"`
		Database int    `json:"database"`
	} `json:"redis"`
}

var (
	appConfig *AppConfig
)

func getConfigFilePath() string {
	val, found := os.LookupEnv("CFGPATH")
	if !found {
		return "config/config.json" //The default config file path.
	}
	return val
}

func init() {
	file, err := ioutil.ReadFile(getConfigFilePath())
	if err != nil {
		panic(fmt.Sprintf("Config file reading error: %v\n", err))
	}
	appConfig = &AppConfig{}
	if json.Unmarshal(file, appConfig) != nil {
		panic(fmt.Sprintf("Config file reading error: %v\n", err))
	}
}

func Get() AppConfig {
	return *appConfig
}
