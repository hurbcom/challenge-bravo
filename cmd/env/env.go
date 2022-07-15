// Package env is meant to be used while starting the system.
// It will pass the environment information to a Go struct named Data.
// You can either fetch the environment information from a file or from env vars.
package env

import (
	"bufio"
	"bytes"
	"embed"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"time"
)

// Env embeds the .env file
//go:embed .env
var Env embed.FS

// Data is the struct that will hold the env information.
type Data struct {
	PQHost string
	PQUser string
	PQPass string
	PQDB   string

	AbstractAPIKey string

	WebserverTimeout time.Duration
	WebserverAddress string
}

// Load loads the env into a Data struct.
// If a envFile is not passed (envFile == ""), Load will fetch from env vars.
func Load(envFile string) (Data, error) {
	if envFile != "" {
		return loadFromFile(envFile, Env)
	}

	return loadFromEnvVars()
}

func loadFromFile(envFileName string, fs embed.FS) (Data, error) {
	file, err := fs.Open(envFileName)
	if err != nil {
		return Data{}, err
	}
	defer file.Close()

	data, err := parseFile(file)
	if err != nil {
		return Data{}, err
	}

	return data, nil
}

func parseFile(file io.Reader) (Data, error) {
	var data Data

	if file == nil {
		return data, errors.New("passed file is nil")
	}

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		byts := scanner.Bytes()
		if len(byts) == 0 {
			continue
		}

		if bytes.HasPrefix(byts, []byte(`//`)) {
			// ignore comments
			continue
		}

		index := bytes.Index(byts, []byte(`=`))
		if index == -1 {
			return data, fmt.Errorf("invalid line found in env file: %s", string(byts))
		}

		key := string(byts[:index])
		value := string(bytes.TrimSpace(byts[index+1:]))
		switch k := strings.ToLower(key); k {
		case "postgres_host":
			data.PQHost = value
		case "postgres_user":
			data.PQUser = value
		case "postgres_password":
			data.PQPass = value
		case "postgres_db":
			data.PQDB = value
		case "abstract_api_key":
			data.AbstractAPIKey = value
		case "webserver_timeout":
			dur, err := time.ParseDuration(value)
			if err != nil {
				return data, fmt.Errorf("it was not possible to parse the timeout duration, err: %w", err)
			}
			data.WebserverTimeout = dur
		case "webserver_address":
			data.WebserverAddress = value
		default:
			return data, errors.New("unknown key (" + k + ") in env file")
		}
	}

	var emptyData Data
	if data == emptyData {
		return data, errors.New("env file is empty")
	}

	return data, nil
}

func loadFromEnvVars() (Data, error) {
	dur, err := time.ParseDuration(os.Getenv("WEBSERVER_TIMEOUT"))
	if err != nil {
		return Data{}, err
	}

	return Data{
		PQHost: os.Getenv("POSTGRES_HOST"),
		PQUser: os.Getenv("POSTGRES_USER"),
		PQPass: os.Getenv("POSTGRES_PASSWORD"),
		PQDB:   os.Getenv("POSTGRES_DB"),

		AbstractAPIKey: os.Getenv("ABSTRACT_API_KEY"),

		WebserverTimeout: dur,
		WebserverAddress: os.Getenv("WEBSERVER_ADDRESS"),
	}, nil
}
