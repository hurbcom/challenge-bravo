package application

import (
	"encoding/json"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	"github.com/iiurydias/challenge-bravo/api/cache"
	"os"
)

type Config struct {
	Cache      cache.Config  `json:"cache"`
	LogLevel   int           `json:"logLevel"`
	ServerPort int           `json:"serverPort"`
	GrpcServer client.Config `json:"grpcHost"`
}

func NewConfigFile(filename string) error {
	err := generateConfigFile(filename, configSample())
	if err != nil {
		return err
	}
	return nil
}

func generateConfigFile(filename string, config Config) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}
	_, err = file.Write(data)
	if err != nil {
		return err
	}
	return nil
}

func configSample() Config {
	var c Config
	return c
}
