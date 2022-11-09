package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/joho/godotenv"
)

func GetConfig() *entities.Config {
	_, err := os.Stat(".env")

	if !os.IsNotExist(err) {
		err := godotenv.Load(".env")

		if err != nil {
			log.Println("Error while reading the env file", err)
			panic(err)
		}
	}

	dbPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic(err)
	}

	config := &entities.Config{
		Database: entities.DatabaseConfig{
			Host:     os.Getenv("DB_HOST"),
			Port:     dbPort,
			DbName:   os.Getenv("DB_NAME"),
			Username: os.Getenv("POSTGRES_USER"),
			Password: os.Getenv("POSTGRES_PASSWORD"),
		},
	}

	return config
}

func GetTestConfig() *entities.Config {
	_, err := os.Stat(".env")

	if !os.IsNotExist(err) {
		err := godotenv.Load(".env")

		if err != nil {
			log.Println("Error while reading the env file", err)
			panic(err)
		}
	}

	dbPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic(err)
	}

	config := &entities.Config{
		Database: entities.DatabaseConfig{
			Host:     os.Getenv("DB_HOST_TEST"),
			Port:     dbPort,
			DbName:   os.Getenv("DB_NAME_TEST"),
			Username: os.Getenv("POSTGRES_USER"),
			Password: os.Getenv("POSTGRES_PASSWORD"),
		},
	}

	fmt.Printf("AQUIIII")
	fmt.Print(config)

	return config
}
