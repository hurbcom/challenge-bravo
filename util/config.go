package util

import (
	"github.com/spf13/viper"
)

// Config stores all configuration of the application
// The values are read by viper from a config file or environment variables
type Config struct {
	ServerAddress            string `mapstructure:"SERVER_ADDRESS"`
	ServerCORSAllowedOrigins string `mapstructure:"SERVER_CORS_ALLOWED_ORIGINS"`
	ServerLogLevel           string `mapstructure:"SERVER_LOG_LEVEL"`
	ServerLogJSONFormat      bool   `mapstructure:"SERVER_LOG_JSON_FORMAT"`
	DBDriver                 string `mapstructure:"DB_DRIVER"`
	DBURL                    string `mapstructure:"DB_URL"`
	DBMigrationURL           string `mapstructure:"DB_MIGRATION_URL"`
	CacheURL                 string `mapstructure:"CACHE_URL"`
	CacheExpiration          string `mapstructure:"CACHE_EXPIRATION"`
	ExchangeRateURL          string `mapstructure:"EXCHANGE_RATE_URL"`
}

// loadConfig reads configurations from file or environment variables
func LoadConfig(path string) (config *Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("config")
	viper.SetConfigType("env")

	viper.SetDefault("SERVER_ADDRESS", ":9000")
	viper.SetDefault("SERVER_CORS_ALLOWED_ORIGINS", "")
	viper.SetDefault("SERVER_LOG_LEVEL", "DEBUG")
	viper.SetDefault("SERVER_LOG_JSON_FORMAT", true)
	viper.SetDefault("DB_DRIVER", "")
	viper.SetDefault("DB_URL", "")
	viper.SetDefault("DB_MIGRATION_URL", "")
	viper.SetDefault("CACHE_URL", "")
	viper.SetDefault("CACHE_EXPIRATION", "1m")
	viper.SetDefault("EXCHANGE_RATE_URL", "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
		} else {
			return config, err
		}
	}

	err = viper.Unmarshal(&config)

	return config, err
}
