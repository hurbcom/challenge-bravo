// Importa todas as variaveis de configuração da aplicação do config.yaml
// para banco de dados redis e aplicação
package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type dbConfig struct {
	Dialect  string `yaml:"hostname"`
	Address  string `yaml:"address"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	Name     string `yaml:"name"`
	Port     string `yaml:"port"`
	Charset  string `yaml:"charset"`
}

type redisConfig struct {
	Address  string `yaml:"address"`
	Port     string `yaml:"port"`
}

type appConfig struct {
	Address string `yaml:"address"`
	Port    string `yaml:"port"`
}

type Config struct {
	Database  []dbConfig    `yaml:"database"`
	Redis     []redisConfig `yaml:"redis"`
	App       []appConfig   `yaml:"app"`
}

var (
  conf *Config
)

func GetConf() *Config {
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	err := viper.ReadInConfig()

	if err != nil {
		fmt.Printf("%v", err)
	}

	conf := &Config{}
	err = viper.Unmarshal(conf)
	if err != nil {
		fmt.Printf("unable to decode into config struct, %v", err)
	}

	return conf
}
