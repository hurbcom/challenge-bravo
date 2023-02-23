package util

import (
	"github.com/spf13/viper"
)

// Config stores all configuration of the application
// The values are read by viper from a config file or environment variables
type Config struct {
	ServerAddress       string `mapstructure:"SERVER_ADDRESS"`
	ServerLogLevel      string `mapstructure:"SERVER_LOG_LEVEL"`
	ServerLogJSONFormat bool   `mapstructure:"SERVER_LOG_JSON_FORMAT"`
	DBDriver            string `mapstructure:"DB_DRIVER"`
	DBURL               string `mapstructure:"DB_URL"`
	DBMigrationURL      string `mapstructure:"DB_MIGRATION_URL"`
	CacheURL            string `mapstructure:"CACHE_URL"`
	CacheExpiration     string `mapstructure:"CACHE_EXPIRATION"`
}

// loadConfig reads configurations from file or environment variables
func LoadConfig(path string) (config *Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("config")
	viper.SetConfigType("env")

	viper.SetDefault("SERVER_ADDRESS", ":9000")
	viper.SetDefault("SERVER_LOG_LEVEL", "DEBUG")
	viper.SetDefault("SERVER_LOG_JSON_FORMAT", true)
	viper.SetDefault("CACHE_EXPIRATION", "1m")

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
