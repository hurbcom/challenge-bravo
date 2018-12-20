package config

/**
  Config file mapping and loading logic.
*/

import (
	"encoding/json"
	"io/ioutil"
	"log"
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
		UpdateInterval int32  `json:"updateInterval"`
		ExternalAPIs   struct {
			Currency struct {
				URL    string `json:"url"`
				APIKey string `json:"apiKey"`
			}
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
		return "/home/xuma/Programming/go/src/schonmann/challenge-bravo/config/config.json" //The default config file path.
	}
	return val
}

func init() {
	file, err := ioutil.ReadFile(getConfigFilePath())
	if err != nil {
		log.Fatalf("Config file reading error: %v\n", err)
	}
	appConfig = &AppConfig{}
	if json.Unmarshal(file, appConfig) != nil {
		log.Fatalf("Config file serialization error: %v\n", err)
	}
}

func Get() AppConfig {
	return *appConfig
}
