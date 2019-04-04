package config

import (
	"errors"
	"fmt"
	"os"
)

var (
	//Config holds all API configurations
	Config = make(map[string]string)
)

//InitConfig checks if all environment variables are defined
//and put them in a config map
func InitConfig() error {
	envKeyVars := []string{
		"FIXER_ENDPOINT",
		"FIXER_ACCESS_KEY",
		"COINMARKET_ENDPOINT",
		"COINMARKET_ACCESS_KEY",
		"CURRENCY_SYMBOLS",
		"CRYPTO_CURRENCY_SYMBOLS",
		"DB_ADDRESS",
		"DB_PORT",
		"DB_PASS",
		"DB_HASH",
		"ALLOW_ORIGINS",
		"API_PORT",
		"REFRESH_INTERVAL",
	}

	for _, key := range envKeyVars {
		value, ok := os.LookupEnv(key)
		if !ok {
			errorMessage := fmt.Sprintf("Missing environment variable: %s", key)
			return errors.New(errorMessage)
		}
		Config[key] = value
	}
	return nil
}
