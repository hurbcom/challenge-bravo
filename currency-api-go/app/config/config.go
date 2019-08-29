
package config

type Config struct {
	DB *DBConfig
}

type DBConfig struct {
	Dialect  string
	Username string
	Password string
	Name     string
	Charset  string
}

func GetConfig() *Config {
	return &Config{
		DB: &DBConfig{
			Dialect:  "mysql",
			Username: "root",
			Password: "root",
			Name:     "currency",
			Charset:  "utf8",
		},
	}
}
/*package config
	
	import (
		"github.com/spf13/viper"
	)
	type Config struct {
		Dialect  string
		Username string
		Password string
		Name     string
		Charset  string
	}
	
	func InitConfig() (*Config, error) {
		config := &Config{
			Dialect: viper.GetString("mysql"),
			Username: viper.GetString("root"),
			Password: viper.GetString("root"),
			Name: viper.GetString("currency"),
			Charset: viper.GetString("utf8"),
		}
		if config.DatabaseURI == "" {
			return nil, fmt.Errorf("DatabaseURI must be set")
		}
		return config, nil
	}*/